import type { Config } from "tailwindcss";

const config: Config = {
  prefix: 'dcc-',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/lib/**/*.js",
  ],
  theme: {
    colors: {
      teal: "#0B7A7D",
      black: "#000000",
      white: "#FFFFFF",
      darkNavy: "#2f4757",
      gray: "#d1d5db",
      transparent: "transparent",
      alertWarning: "#856404",
      alertWarningBackground: "#FFF3CD",
      alertWarningBorder: "#FFEEBA",
      alertInformation: "#004085",
      alertInformationBackground: "#CCE5FF",
      alertInformationBorder: "#B8DAFF",
      alertDanger: "#842029",
      alertDangerBackground: "#F8D7DA",
      alertDangerBorder: "#F5C2C7",
      alertSuccess: "#155724",
      alertSuccessBackground: "#D4EDDA",
      alertSuccessBorder: "#C3E6EB",
      errorRed: "#DC3545",
      bodyBg: "#f0f0f0"
    },
    fontSize: {
      'xs': '12px', // extra small
      'sm': '14px', // small
      'base': '16px', // default
      'lg': '18px', // large
      'xl': '20px', // extra large 
      '2xl': '40px', // double extra large
      '3xl': '70px', // triple large
      '4xl': '120px', // quad large
    },
    screens: {
      'xs': '6px',
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1024px',
      '2xl': '1280px',
      '3xl': '1440px',
      '4xl': '1536px',
      '5xl': '1920px',
      'ios': { 'raw': '@supports (-webkit-touch-callout: none)' },
      'md-tall': { 'raw': '(min-height: 720px) and (min-width: 768px) ' }, // trageting heights
      'xl-tall': { 'raw': '(min-height: 720px) and (min-width: 1024px) ' },
      '2xl-tall': { 'raw': '(min-height: 720px) and (min-width: 1280px) ' },
      '5xl-tall': { 'raw': '(min-height: 720px) and (min-width: 1280px) ' },
    }
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "dcc-", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root",
  },
};
export default config;
