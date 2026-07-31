let currentFolder = '';

// 1. Alternar Tema (Claro/Escuro)
const btnTheme = document.getElementById('btnTheme');
btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    btnTheme.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
});

// NOVO: Habilitar/Desabilitar o menu de qualidade
const radios = document.querySelectorAll('input[name="format"]');
const qualitySelect = document.getElementById('qualitySelect');
radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        qualitySelect.disabled = (e.target.value !== 'mp4');
    });
});

// 2. Escolher Pasta
document.getElementById('btnFolder').addEventListener('click', async () => {
    const folder = await window.api.selectFolder();
    if (folder) {
        currentFolder = folder;
        document.getElementById('folderPath').value = folder;
        document.getElementById('btnOpenFolder').style.display = 'inline-block';
    }
});

// 3. Abrir Pasta
document.getElementById('btnOpenFolder').addEventListener('click', () => {
    if (currentFolder) window.api.openFolder(currentFolder);
});

// 4. Auto-Colar Seguro
document.getElementById('urlInput').addEventListener('focus', () => {
    try {
        const input = document.getElementById('urlInput');
        if (input.value !== '') return;
        
        const clipText = window.api.readClipboard();
        if (clipText && (clipText.startsWith('http://') || clipText.startsWith('https://'))) {
            input.value = clipText.trim();
        }
    } catch (err) {
        console.error("Erro no auto-colar:", err);
    }
});

// 5. Atualizar Motor
document.getElementById('btnUpdateEngine').addEventListener('click', async () => {
    const btn = document.getElementById('btnUpdateEngine');
    btn.textContent = '⏳ Atualizando...';
    btn.disabled = true;
    
    const result = await window.api.updateEngine();
    if (result.success) {
        alert('Motor atualizado com sucesso! Pronto para baixar.');
    } else {
        alert('Erro ao atualizar: ' + result.message);
    }
    
    btn.textContent = '🔄 Atualizar Motor';
    btn.disabled = false;
});

// 6. Baixar Link Único
document.getElementById('btnDownload').addEventListener('click', () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert('Por favor, insira um link!');
        return;
    }
    if (!currentFolder) {
        alert('Por favor, escolha uma pasta para salvar!');
        return;
    }

    const format = document.querySelector('input[name="format"]:checked').value;
    const isPlaylist = document.getElementById('checkPlaylist').checked;
    const quality = qualitySelect.value; // Pega a qualidade

    adicionarNaFila(url);
    window.api.startDownload({ url, format, folder: currentFolder, isPlaylist, quality });
    document.getElementById('urlInput').value = ''; 
});

// 7. Carregar Arquivo TXT
document.getElementById('btnLoadTxt').addEventListener('click', async () => {
    if (!currentFolder) {
        alert('Por favor, escolha uma pasta primeiro!');
        return;
    }
    const links = await window.api.selectTxt();
    if (links && links.length > 0) {
        const format = document.querySelector('input[name="format"]:checked').value;
        const isPlaylist = document.getElementById('checkPlaylist').checked;
        const quality = qualitySelect.value; // Pega a qualidade
        
        links.forEach(url => {
            if (url.startsWith('http')) {
                adicionarNaFila(url);
                window.api.startDownload({ url, format, folder: currentFolder, isPlaylist, quality });
            }
        });
    }
});

// 8. Funções Visuais das Listas
function adicionarNaFila(url) {
    const ul = document.getElementById('queueList');
    const li = document.createElement('li');
    li.id = 'item-' + btoa(url).replace(/[^a-zA-Z0-9]/g, ''); 
    li.innerHTML = `
        <span class="link-text">${url}</span>
        <span class="status" style="font-weight:bold;">0%</span>
        <div class="progress-bar" id="prog-${li.id}"></div>
    `;
    ul.appendChild(li);
}

function moverParaConcluido(url) {
    const id = 'item-' + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
    const li = document.getElementById(id);
    if (li) {
        li.querySelector('.status').textContent = 'Concluído';
        li.querySelector('.progress-bar').style.width = '100%';
        li.querySelector('.progress-bar').style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; 
        document.getElementById('successList').appendChild(li);
    }
}

function moverParaErro(url) {
    const id = 'item-' + btoa(url).replace(/[^a-zA-Z0-9]/g, '');
    const li = document.getElementById(id);
    if (li) {
        li.querySelector('.status').textContent = 'Erro';
        li.querySelector('.progress-bar').style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; 
        document.getElementById('errorList').appendChild(li);
    }
}

// 9. Ouvintes de Eventos
window.api.onDownloadProgress((event, data) => {
    const id = 'item-' + btoa(data.url).replace(/[^a-zA-Z0-9]/g, '');
    const li = document.getElementById(id);
    if (li) {
        li.querySelector('.status').textContent = data.percent + '%';
        li.querySelector('.progress-bar').style.width = data.percent + '%';
    }
});

window.api.onDownloadComplete((event, data) => moverParaConcluido(data.url));
window.api.onDownloadError((event, data) => moverParaErro(data.url));