import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts()],
  build: {
    sourcemap: true,
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/StructBuffer.ts'),
      name: 'StructBuffer',
      // the proper extensions will be added
      fileName: 'wgsl-struct-buffer',
    },
  },
});
