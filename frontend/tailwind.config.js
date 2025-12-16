/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#EBD96B",
          yellowLight: "#E5C643",
          yellowDark: "#E0C340",
          grayLight: "#F4F6F5",
          grayMedium: "#8E8E8E",
          gray: "#7F7F7F",
          grayDark: "#191818",
          grayDarker: "#242323",
          black: "#000000",
          white: "#FFFFFF",
          // Vibrant colors from Figma
          beige: "#D4B5A0",
          beigeLight: "#E8D5C4",
          pink: "#E8B4B8",
          pinkLight: "#F5D5D8",
          orange: "#FF8C42",
          orangeLight: "#FFB380",
          purple: "#9B7EBD",
          purpleLight: "#C5B3D9",
          cyan: "#A8D8E8",
          cyanLight: "#C8E6F0",
          mint: "#B8D4A8",
          mintLight: "#D4E8C8",
          blue: "#5B9BD5",
          blueLight: "#8FB9E0",
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        secondary: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        hero: ["45.6px", { lineHeight: "57px", letterSpacing: "0.57px" }],
        "section-heading": ["30px", { lineHeight: "37px", letterSpacing: "0.57px" }],
        "section-heading-sm": ["22.8px", { lineHeight: "23.75px", letterSpacing: "0.57px" }],
        "product-title": ["15.2px", { lineHeight: "17.1px" }],
        "body-lg": ["11.4px", { lineHeight: "normal", letterSpacing: "-0.76px" }],
        "body-sm": ["10.45px", { lineHeight: "normal" }],
        "small": ["8.658px", { lineHeight: "9.47px", letterSpacing: "0.13px" }],
        "tiny": ["6.5px", { lineHeight: "14.156px", letterSpacing: "0.26px" }],
      },
      borderRadius: {
        sm: "4px",
        "sm-tight": "2.2px",
        md: "10px",
        lg: "25px",
        button: "4.75px",
      },
      boxShadow: {
        card: "0px 4px 12px rgba(0,0,0,0.10)",
        elevated: "0px 4px 50px rgba(0,0,0,0.25)",
      },
      spacing: {
        xs: "5px",
        sm: "11px",
        md: "17px",
        lg: "30px",
        xl: "48px",
        "2xl": "64px",
      },
      letterSpacing: {
        nav: "0.14em",
        heading: "0.57px",
        body: "-0.76px",
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      backgroundImage: {
        'gradient-yellow': 'linear-gradient(to right, #E0C340, #FAE157)',
      },
    },
  },
  plugins: [],
}
