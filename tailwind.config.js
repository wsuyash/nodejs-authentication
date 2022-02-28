module.exports = {
	content: [
		'./views/**/*.ejs',
	],
	purge: [
		'./views/**/*.ejs',
	],
  theme: {
    extend: {},
  },
  plugins: [
		require('tailwindcss'),
		require('autoprefixer')
	],
}
