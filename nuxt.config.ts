// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["flyonui/flyonui"],
    },
  },
  modules: ["nuxt-charts"],
  app: {
    head: {
      title: "Nuxt4 Flyon Starter",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
      script: [],
    },
  },
});
