// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devServer: {
    port: 8000,
  },
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
      include: ["flyonui/flyonui", "date-fns", "@microsoft/fetch-event-source"],
    },
  },
  modules: ["nuxt-charts", "@nuxt/image", "@pinia/nuxt", "nuxt-notify"],
  notify: {
    position: "top-right",
    duration: 5000,
    maxToasts: 8,
    theme: "system", // 'light' | 'dark' | 'system'
    showIcon: false,
  },
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
    REGENT_TRACKING_CERTIFICATES_BASE_URL: "",
    REGENT_TRACKING_CERTIFICATES_API_KEY: "",
    COLV_BASE_URL: "",
    COLV_KEY_PASSKEY: "",
    COLV_API_KEY_SECRET: "",
    IPRS_BASE_URL: "",
    IPRS_API_KEY: "",
    COLV_CID: "",
    AVA_BASE_URL: "",
    LEGACY_VALUATION_BASE_URL: "",
    LEGACY_VALUATION_API_KEY: "",
    RUN_URL: "",
    public: {
      SETTINGS_SUPPORTED_THEMES: "",
      COPYRIGHT_YEAR: "",
      PAGE_SIZE: "",
      GOOGLE_MAPS_API_KEY: "",
      GOOGLE_MAPS_GEOFENCING_COUNTRY: "",
      RUN_ENV: "",
    },
  },
});
