/** @type {import('tailwindcss').Config} */
const { join } = require('path');

const colors = ["red", "blue", "green", "yellow", "purple"]; // adjust based on your app


module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './node_modules/@rnr/**/*.{ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  safelist: [
    "flex-1",
    // Specific classes
    "bg-blue-500",
    "bg-red-500",
    "bg-green-500",
    // Pattern: all bg-<color>-500 classes
    {
      pattern: new RegExp(`bg-(${colors.join("|")})-500`),
    },
    // If you later need hover variants
    {
      pattern: new RegExp(`hover:bg-(${colors.join("|")})-600`),
      variants: ["hover"],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}