// base './' permite que el build funcione en GitHub Pages con rutas
// relativas a los assets, sin depender del nombre del repo.
export default {
  // config options
  // root: "src/",
  root: "./",
  // publicDir: "../static/",
  publicDir: "./public/",
  // base: "./",
  base: "/thesis-project/",
  build: {
    // three.js (^0.186.1) domina el bundle (~500 kB minificado); el peso
    // total actual es ~601 kB con gzip 154 kB, sin problema real de tamaño.
    // El umbral por defecto de Vite (500 kB) solo ruido aquí → 650 kB.
    chunkSizeWarningLimit: 650,
  },
  resolve: {
    alias: {
      // "@": "/src",
    },
  },
  server: {
    // port: 3000,
    host: true,
  },
};
