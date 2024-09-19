export default defineNuxtConfig({
  // Include global CSS (for Vuetify and Material Design Icons)
  css: [
    "vuetify/lib/styles/main.sass", // Vuetify's main styles
    "@mdi/font/css/materialdesignicons.min.css", // Material Design Icons
  ],

  // Ensure Vuetify components are transpiled
  build: {
    transpile: ["vuetify"],
  },

  // Vite-specific configurations
  vite: {
    // CSS options for Sass
    css: {
      preprocessorOptions: {
        sass: {
          api: "modern-compiler", // Use modern Sass compiler
        },
      },
    },

    // Allow serving files from specific directories (for fonts, etc.)
    server: {
      fs: {
        allow: [
          "./", // The current project root
          "../", // Allow accessing files in parent directories
          "/Users/hyf/node_modules/@mdi/font", // Explicitly allow serving from the `@mdi/font` directory
        ],
      },
      proxy: {
        "/api": {
          target: "https://zenquotes.io",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    // Ensure Vite resolves symlinks correctly
    resolve: {
      preserveSymlinks: true,
    },
  },
});
