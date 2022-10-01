import { defineConfig } from 'vite'
import path from 'path';

const toPath = (filePath) => path.join(process.cwd(), filePath);

export default defineConfig({
  server: {
    port: 3000,
    host: true,
  },
  esbuild: {
    jsxFactory: 'h',
    jsxInject: `import { jsx } from '@/jsx';`,
  },
  resolve: {
    alias: {
      '@': toPath('src'),
    }
  }
})