export default defineNuxtConfig({
  css: [
    "vuetify/lib/styles/main.sass", // Vuetify'in ana stilleri
  ],

  // Build ayarları (Vuetify bileşenlerinin doğru şekilde derlenmesi için)
  build: {
    transpile: ["vuetify"],
  },

  // Head kısmına CDN üzerinden Material Design Icons ekliyoruz
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@mdi/font/css/materialdesignicons.min.css", // CDN üzerinden MDI
      },
    ],
  },

  // Nuxt.js build modülleri
  buildModules: [
    "@nuxt/typescript-build", // TypeScript desteği
    "@nuxtjs/vuetify", // Vuetify modülü
  ],

  // Sunucu middleware ayarları (API proxy için)
  serverMiddleware: [
    { path: "/api", handler: "~/server/api/quotes.js" }, // ZenQuotes API rotası
  ],

  // Axios ya da proxy ayarları, API isteklerini yönlendirmek için
  axios: {
    proxy: true,
  },

  proxy: {
    "/api": {
      target: "https://zenquotes.io", // ZenQuotes API hedefi
      changeOrigin: true, // CORS sorunlarını önlemek için origin değiştirilir
      pathRewrite: { "^/api": "" }, // API yolunu yeniden yazar ("/api" kaldırılır)
    },
  },

  // Vuetify ayarları (isteğe bağlı olarak özelleştirilebilir)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true, // Sadece kullanılan bileşenlerin dahil edilmesi
  },
});
