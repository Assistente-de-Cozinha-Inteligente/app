/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#22A45D',
        secondary: '#43B726',
        info: '#186DDD',
        warning: '#F7DE00',
        danger: '#E23D24',
        mainText: '#010F07',
        bodyText: '#757575',
        white: '#FFFFFF',
        input: '#F6F8FC',
      },
      fontFamily: {
        sans: ['Poppins-Regular', 'system-ui'],
        'poppins-thin': ['Poppins-Thin'],
        'poppins-light': ['Poppins-Light'],
        'poppins-regular': ['Poppins-Regular'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-extrabold': ['Poppins-ExtraBold'],
        'poppins-black': ['Poppins-Black'],
      },
    },
  },
  plugins: [],
}

