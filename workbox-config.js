module.exports = {
	globDirectory: 'dist/',
	globPatterns: [
		'**/*.{js,css,json,html,webmanifest}'
	],
	swDest: 'dist/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};