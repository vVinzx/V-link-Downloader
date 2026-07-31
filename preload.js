const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('api', {
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    openFolder: (path) => ipcRenderer.send('open-folder', path),
    selectTxt: () => ipcRenderer.invoke('select-txt'),
    updateEngine: () => ipcRenderer.invoke('update-engine'),
    startDownload: (data) => ipcRenderer.send('start-download', data),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', callback),
    onDownloadComplete: (callback) => ipcRenderer.on('download-complete', callback),
    onDownloadError: (callback) => ipcRenderer.on('download-error', callback),
    readClipboard: () => clipboard.readText() // <-- Isso aqui faz o auto-colar funcionar sem bugar!
});