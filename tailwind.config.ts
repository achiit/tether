import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgLight: "#f8f9fa",
        bgDark: "#000000", 
        text: "#E4E4E7",
        pink: "#FC2FA4",
        purple: "#902DFF",
        blue: "#4B4CF6",
      },
      backgroundImage: {
        'light-gradient': 'radial-gradient(130% 120% at 50% 50%, #C6E7FF33 0%, #f1f1f1 100%)',
        'dark-gradient': 'radial-gradient(130% 120% at 50% 50%, #262626 0%, #282828 100%)',
        'gradient-button': 'linear-gradient(101deg, #fc2fa4, #902dff 57%, #4b4cf6)',
        'gradient-button-green': 'linear-gradient(101deg, #6fcf97,  #902dff 57%, #219653)',
      },
      fontFamily: {
        manrope: ["var(--font-manrope)"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "spin-slower": "spin 5s linear infinite",
        "reverse-spin": "reverse-spin 5s linear infinite",
        'shimmer-slide': 'shimmer-slide 3s linear infinite',
      },
      keyframes: {
        "reverse-spin": {
          from: {
            transform: "rotate(360deg)",
          },
        },
        'shimmer-slide': {
          '0%': { transform: 'translateX(-400%) skewX(-30deg)' },
          '100%': { transform: 'translateX(400%) skewX(-30deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
