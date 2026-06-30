import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const removeConsolePlugin = () => ({
  name: 'remove-console',
  apply: 'build',
  transform(code, id) {
    if (!id.includes('/src/') && !id.includes('\\src\\')) {
      return null;
    }

    return {
      code: code.replace(
        /^\s*console\.(debug|error|info|log|warn)\([^;]*\);\s*$/gm,
        '',
      ),
      map: null,
    };
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [removeConsolePlugin(), react()],
});
