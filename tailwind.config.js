/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: "#00a7ef",
            0: "#e6f7fd",
            50: "#cdeffc",
            300: "#33baf2",
            500: "#0096d7",
          },
          orange: {
            DEFAULT: "#ff5e07",
            0: "#fff0e8",
            300: "#ff864d",
          },
        },
        grey: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e9eaeb",
          300: "#d5d7da",
          400: "#a4a7ae",
          500: "#717680",
          600: "#535862",
          700: "#414651",
          800: "#252b37",
        },
        black: "#131313",
        success: {
          DEFAULT: "#12b76a",
          50: "#ecfdf3",
          500: "#12b76a",
        },
        error: {
          DEFAULT: "#f04438",
          0: "#fffbfa",
          500: "#f04438",
        },
        accent: {
          yellow: "#ffc700",
          green: "#61ba47",
          blue: "#007aff",
          pink: "#f74f9e",
          red: "#ff5257",
          purple: "#a550a7",
        },
      },
      fontSize: {
        "heading-2": ["40px", { lineHeight: "48px", letterSpacing: "-1px" }],
        "heading-3": ["32px", { lineHeight: "38.4px", letterSpacing: "-1px" }],
        "heading-4": ["24px", { lineHeight: "33.6px", letterSpacing: "-1px" }],
        "body-xl": ["20px", { lineHeight: "28px" }],
        "body-l": ["18px", { lineHeight: "25.2px" }],
        "body-base": ["16px", { lineHeight: "24px" }],
        "body-s": ["14px", { lineHeight: "21px" }],
        "body-xs": ["12px", { lineHeight: "16.8px" }],
      },
    },
  },
  plugins: [],
};
