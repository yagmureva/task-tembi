export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],

  // Build ayarları (Vuetify bileşenlerinin doğru şekilde derlenmesi için)
  build: {
    transpile: ["vuetify"],
  },

  // Sunucu middleware ayarları (API proxy için)
  serverMiddleware: [
    { path: "/api", handler: "~/server/api/quotes.js" }, // ZenQuotes API rotası
  ],

  proxy: {
    "/api": {
      target: "https://zenquotes.io", // ZenQuotes API hedefi
      changeOrigin: true, // CORS sorunlarını önlemek için origin değiştirilir
      pathRewrite: { "^/api": "" }, // API yolunu yeniden yazar ("/api" kaldırılır)
    },
  },

  compatibilityDate: "2024-09-20",
});