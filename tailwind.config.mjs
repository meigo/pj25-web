const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  safelist: [
    "overflow-hidden",
    "-rotate-1",
    "-rotate-2",
    "-rotate-3",
    "-rotate-4",
    "-rotate-5",
    "rotate-1",
    "rotate-2",
    "rotate-3",
    "rotate-4",
    "rotate-5",
    "fill-pj-pink",
    "fill-pj-violet",
    "fill-pj-blue",
    "fill-pj-yellow",
    "fill-pj-cyan",
    "fill-white",
    "fill-black",
    "bg-pj-pink",
    "bg-pj-violet",
    "bg-pj-blue",
    "bg-pj-yellow",
    "bg-pj-cyan",
    "bg-white",
    "bg-black",
    "ring-white",
    "ring",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
        "6xl": "4rem",
      },
      borderWidth: {
        5: "5px",
        6: "6px",
        8: "8px",
      },
      lineHeight: {
        1: ".25rem",
        2: ".5rem",
      },
      height: {
        22: "5.5rem",
      },
      rotate: {
        16: "16deg",
        20: "20deg",
        24: "24deg",
      },
      animation: {
        wiggle: "wiggle 1s ease-in-out infinite",
        "scale-pulse": "scale-pulse 0.5s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "scale-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
        },
      },
      zIndex: {
        "-1": "-1",
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      fontFamily: {
        // vodka: "VodkaSans",
        // vag: "VagRounded",
        bds: "BDSupper",
      },
      fontSize: {
        "10xl": "10rem",
        "11xl": "12rem",
        "3vw": ["3vw", { lineHeight: "3vw" }],
        "4vw": ["4vw", { lineHeight: "4vw" }],
        "5vw": ["5vw", { lineHeight: "5vw" }],
        "6vw": ["6vw", { lineHeight: "7vw" }],
        "8vw": ["8vw", { lineHeight: "9vw" }],
        "9vw": ["9vw", { lineHeight: "10vw" }],
        "10vw": "10vw",
        "11vw": "11vw",
        "12vw": "12vw",
        "13vw": "13vw",
        "14vw": "14vw",
        "15vw": "15vw",
        "16vw": "16vw",
        "18vw": "18vw",
        "20vw": "20vw",
      },
      colors: {
        "pj-pink": "#FF80A6",
        "pj-violet": "#9046D0",
        "pj-violet-light": "#553E79",
        "pj-yellow": "#FBAA48",
        "pj-blue": "#0000FF",
        "pj-blue-light": "#1F9FF5",
        "pj-cyan": "#92FFA1",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addUtilities, matchVariant }) {
      addUtilities({
        ".horizontal-tb": {
          writingMode: "horizontal-tb",
        },
        ".vertical-rl": {
          writingMode: "vertical-rl",
        },
        ".vertical-lr": {
          writingMode: "vertical-lr",
        },
      });
      matchVariant(
        "nth",
        (value) => {
          return `&>*:nth-child(${value})`;
        },
        { values: { 2: "2n-1", 3: "3n-1" } }
      );
    }),
  ],
};

module.exports = config;
