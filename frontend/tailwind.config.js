import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tw: {
          blue: "#1d9bf0",
          border: "#2f3336",
          text: "#e7e9ea",
          muted: "#71767b",
          surface: "#16181c",
          hover: "#080808",
          like: "#f91880",
          repost: "#00ba7c",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        black: {
          primary: "#1d9bf0",
          secondary: "#16181c",
          "base-100": "#000000",
          "base-200": "#16181c",
          "base-300": "#2f3336",
          neutral: "#2f3336",
          "neutral-content": "#e7e9ea",
        },
      },
    ],
  },
};