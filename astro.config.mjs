import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://motka.design',
  build: { format: 'file' }, // /about.html вместо /about/ — совместимо с rsync-деплоем и кейсами
});
