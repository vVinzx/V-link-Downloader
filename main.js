const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        title: "V-Link Media Downloader",
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.webContents.on('context-menu', (event, params) => {
        const menu = Menu.buildFromTemplate([
            { role: 'cut', label: 'Recortar' },
            { role: 'copy', label: 'Copiar' },
            { role: 'paste', label: 'Colar' },
            { type: 'separator' },
            { role: 'selectAll', label: 'Selecionar Tudo' }
        ]);
        menu.popup(win, params.x, params.y);
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    return result.canceled ? null : result.filePaths[0];
});

ipcMain.on('open-folder', (event, folderPath) => {
    shell.openPath(folderPath);
});

ipcMain.handle('select-txt', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Arquivos de Texto', extensions: ['txt'] }]
    });
    if (result.canceled) return null;
    try {
        const content = fs.readFileSync(result.filePaths[0], 'utf-8');
        return content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    } catch (err) {
        return null;
    }
});

ipcMain.handle('update-engine', async () => {
    return new Promise((resolve) => {
        const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe');
        const updater = spawn(ytDlpPath, ['-U']); 
        let output = '';
        updater.stdout.on('data', (data) => output += data.toString());
        updater.stderr.on('data', (data) => output += data.toString());
        updater.on('close', (code) => {
            if (code === 0 || output.includes('up to date')) resolve({ success: true, message: output });
            else resolve({ success: false, message: output });
        });
        updater.on('error', (err) => resolve({ success: false, message: err.message }));
    });
});

// A MÁGICA DA QUALIDADE ESTÁ AQUI
ipcMain.on('start-download', (event, data) => {
    const { url, format, folder, isPlaylist, quality } = data; // Recebe a qualidade
    const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe');
    
    let args = [
        isPlaylist ? '--yes-playlist' : '--no-playlist',
        '--embed-thumbnail', 
        '--add-metadata',    
        '--newline'
    ];
    
    if (format === 'mp3') {
        args.push('-x', '--audio-format', 'mp3', '-o', path.join(folder, '%(title)s.%(ext)s'), url);
    } else {
        // Configura o comando de acordo com a qualidade selecionada
        let formatString = 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best'; // Padrão "best"
        
        if (quality === '1080') {
            formatString = 'bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4][height<=1080]/best';
        } else if (quality === '720') {
            formatString = 'bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4][height<=720]/best';
        } else if (quality === '480') {
            formatString = 'bestvideo[ext=mp4][height<=480]+bestaudio[ext=m4a]/best[ext=mp4][height<=480]/best';
        }
        
        args.push('-f', formatString, '--merge-output-format', 'mp4', '-o', path.join(folder, '%(title)s.%(ext)s'), url);
    }

    const downloadProcess = spawn(ytDlpPath, args);

    downloadProcess.stdout.on('data', (output) => {
        const text = output.toString();
        const match = text.match(/\[download\]\s+(\d+\.\d+)%/);
        if (match) {
            const percent = parseFloat(match[1]);
            event.reply('download-progress', { url, percent });
        }
    });

    downloadProcess.on('close', (code) => {
        if (code === 0) event.reply('download-complete', { url });
        else event.reply('download-error', { url });
    });
});