/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asphalt: '#090b10',
        pitlane: '#111827',
        ignition: '#f43f1f',
        volt: '#28f29c',
        boost: '#f5c84b',
        graphite: '#1d2430',
      },
      boxShadow: {
        hud: '0 0 0 1px rgba(40, 242, 156, 0.18), 0 20px 60px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
