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
      include: ["flyonui/flyonui", "@microsoft/fetch-event-source"],
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
    REGENT_TRACKING_BASE_URL: "",
    TRACKING_CERTIFICATES_BASE_URL: "",
    TRACKING_CERTIFICATES_API_KEY: "",
    COLV_BASE_URL: "",
    COLV_KEY_PASSKEY: "",
    COLV_API_KEY_SECRET: "",
    COLV_CID: "",
    public: {
      SETTINGS_SUPPORTED_THEMES: "",
      COPYRIGHT_YEAR: "",
      PAGE_SIZE: "",
      GOOGLE_MAPS_API_KEY: "",
    },
  },
});
