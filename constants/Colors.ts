export const Colors = {
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
  white: "#ffffff",
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
  light: {
    background: "#ffffff",
    surface: "#fafafa",
    text: "#131313",
    textSecondary: "#535862",
    textTertiary: "#717680",
    border: "#e9eaeb",
    tint: "#00a7ef",
    tabIconDefault: "#a4a7ae",
    tabIconSelected: "#00a7ef",
  },
  dark: {
    background: "#131313",
    surface: "#252b37",
    text: "#ffffff",
    textSecondary: "#d5d7da",
    textTertiary: "#a4a7ae",
    border: "#414651",
    tint: "#33baf2",
    tabIconDefault: "#717680",
    tabIconSelected: "#33baf2",
  },
} as const;

// Default export for backward compatibility with template files (removed in Phase 2)
export default Colors;
