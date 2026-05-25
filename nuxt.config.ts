import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/image"],
  image: {
    dir: "assets/img",
    quality: 80,
    format: ["webp"],
  },
  css: ["~/assets/css/main.css"],
  // ipxStatic (used with nitro.static) pre-renders images at build time but has no
  // dev server handler — enable runtime ipx in development so /_ipx/* resolves locally.
  $development: {
    nitro: {
      static: false,
    },
  },
  nitro: {
    static: true,
    prerender: {
      crawlLinks: true,
      routes: [
        "/cv-data.json",
        "/swimming-data.json",
        "/activities",
        "/activities/swimming",
      ],
    },
  },
  app: {
    head: {
      viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
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
      baseUrl: "https://nbaizaq.xyz",
      email: "n.baizakof@gmail.com",
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
