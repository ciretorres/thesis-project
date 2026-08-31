// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import vue from '@vitejs/plugin-vue'

const isCodeSandbox =
  "SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env;

export default {
  // config options
  // plugins: [react()],
  // plugins: [vue()],
  root: "src/",
  publicDir: "../static/",
  // base: "./",
  base: "/thesis-project/",
  resolve: {
    alias: {
      // "@": "/src",
    },
  },
  server: {
    // port: 3000,
    host: true,
    // open: !isCodeSandbox, // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    // target: ["es2022", "chrome97", "edge97", "firefox96", "safari15"],
  },
};
