import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-black': '#141414',
        'frequency-purple': '#8a2be2',
        'frequency-violet': '#4b0082',
        'frequency-dark': '#2d1b69',
      },
    },
  },
  plugins: [],
};
export default config;
