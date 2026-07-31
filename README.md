# ⚡ V-Link Media Downloader

**V-Link Media Downloader** é um aplicativo desktop moderno, rápido e elegante para baixar vídeos e áudios de diversas plataformas (YouTube, Instagram, TikTok, Reels, Shorts, etc.). Desenvolvido com foco na simplicidade e usabilidade para o usuário final.

## ✨ Funcionalidades
- 🎵 **Download de Áudio (MP3)** com conversão automática e metadados.
- 🎬 **Download de Vídeo (MP4)** com seleção de qualidade (Melhor, 1080p, 720p, 480p).
- 🗂️ **Suporte a Playlists** para baixar canais ou pastas inteiras de uma só vez.
- 📄 **Carregamento em Lote (.txt)** para enfileirar centenas de links.
- 🔄 **Atualizador de Motor Embutido** (mantém o yt-dlp sempre na última versão contra bloqueios).
- 📋 **Auto-Colar Inteligente** e menu de contexto nativo do Windows (Copiar/Colar).
- 🌙 **Tema Claro e Escuro** nativo.

## 🚀 Tecnologias Utilizadas
- **[Electron](https://www.electronjs.org/)**: Interface de usuário e integração com o sistema operacional.
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)**: Motor poderoso de extração de mídia.
- **[FFmpeg](https://ffmpeg.org/)**: Conversão, mesclagem e processamento de áudio/vídeo.
- **HTML/CSS/JS (Vanilla)**: Interface limpa e sem frameworks pesados.

## 🛠️ Como rodar o projeto localmente

1. Clone este repositório para sua máquina.
2. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
3. Abra o terminal na pasta do projeto e instale as dependências:
   ```bash
   npm install
   ```
4. **IMPORTANTE:** Crie uma pasta chamada `bin/` na raiz do projeto e coloque os seguintes arquivos executáveis dentro dela (você pode baixá-los em seus sites oficiais):
   - `yt-dlp.exe`
   - `ffmpeg.exe`
   - `ffprobe.exe`
5. Para rodar em modo de teste:
   ```bash
   npm start
   ```
6. Para gerar o seu próprio `.exe` portátil:
   ```bash
   npm run build
   ```

## 🤝 Contribuição
Sinta-se à vontade para fazer um **Fork** deste projeto, abrir **Issues** relatando bugs ou enviar **Pull Requests** com melhorias! Como baixar músicas e vídeos é uma necessidade comum, toda ajuda para manter o motor e a interface atualizados é bem-vinda.

---

## ☕ Apoie o Projeto

O V-Link é uma ferramenta de código aberto e 100% gratuita. Se este programa te ajudou a economizar tempo no seu trabalho ou dia a dia, considere pagar um café para o desenvolvedor! ❤️

**Doe via PIX:**
Escaneie o QR Code abaixo com o app do seu banco ou use a chave copia e cola.

<img src="qrcode.jpg" width="250" alt="QR Code PIX PagBank">

**Chave PIX:** `c662eeb2-6e5d-4746-a85e-00b6fce87dec` 
*(Nome: Vinicius Resende Cardoso - PagBank)*

<br>

<a href="https://ko-fi.com/vvinzx" target="_blank">
  <img src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3" height="36" alt="Buy Me a Coffee at ko-fi.com" />
</a>