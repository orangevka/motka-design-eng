import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://motka.design',
  build: { format: 'file' }, // /about.html вместо /about/ — совместимо с rsync-деплоем и кейсами
  devToolbar: { enabled: false }, // убрать панель Astro в dev — не нужна при просмотре вёрстки
  vite: {
    // разрешить доступ через Cloudflare-туннель (trycloudflare.com) при шаринге локалхоста
    server: { allowedHosts: ['.trycloudflare.com'] },
  },
});
