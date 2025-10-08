import tailwindcss from "@tailwindcss/vite";
import Aura from "@primeuix/themes/aura";
import { definePreset } from "@primeuix/themes";

const MyPresetAura = definePreset(Aura, {
  // Your customizations, see the following sections for examples
  // Main color: #5182d2
  semantic: {
    primary: {
      50: "#f6f9fd",
      100: "#d5e1f4",
      200: "#b4c9ec",
      300: "#93b2e3",
      400: "#729adb",
      500: "#5182d2",
      600: "#456fb3",
      700: "#395b93",
      800: "#2d4874",
      900: "#203454",
      950: "#142135",
    },
  },
});

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@primevue/nuxt-module"],
  css: ["~/assets/css/main.css"],
  nitro: {
    static: true,
    prerender: {
      routes: ["/cv-data.json"],
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
    },
  },
  runtimeConfig: {
    public: {
      baseUrl: "https://cv.nbaizaq.xyz",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  primevue: {
    options: {
      theme: {
        preset: MyPresetAura,
        options: {
          darkModeSelector: "light",
        },
        cssLayer: {
          name: "primevue",
          order: "tailwind-base, primevue, tailwind-utilities",
        },
      },
    },
  },
});
