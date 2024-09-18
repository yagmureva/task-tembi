export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          // Ensuring we use the modern compiler for Sass
          api: "modern-compiler",
        },
      },
    },
    resolve: {
      // This setting ensures that Vite can correctly resolve symlinks
      preserveSymlinks: true,
    },
  },
});
