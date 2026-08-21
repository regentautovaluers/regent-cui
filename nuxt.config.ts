// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  imports: {
    dirs: [
      // scan all composables within /composables
      "~/composables/**",

      // scan all types in /types
      "~/types/**",
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["flyonui/flyonui"],
    },
  },
  modules: ["nuxt-charts", "@nuxt/image", "@pinia/nuxt"],
  app: {
    head: {
      title: "Nuxt4 Flyon Starter",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
      ],
    },
  },
  runtimeConfig: {
    VALUATION_BASE_URL: "",
    public: {
      SETTINGS_SUPPORTED_THEMES: "",
      COPYRIGHT_YEAR: "",
      PAGE_SIZE: "",
    },
  },
});
