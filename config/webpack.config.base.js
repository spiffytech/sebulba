const helpers = require('./helpers'),
	CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
	entry: {
		'main': helpers.root('/src/entry.js')
	},
	output: {
		path: helpers.root('/www'),
		filename: 'static/js/[name].[hash].js',
		//publicPath: '/',
	},
	devtool: 'source-map',
	resolve: {
		extensions: ['.ts', '.js', '.html'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
		}
	},
	module: {
		rules: [{
				test: /\.ts$/,
				exclude: /node_modules/,
				enforce: 'pre',
				loader: 'tslint-loader'
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'awesome-typescript-loader'
			},
			{
				test: /\.html$/,
				loader: 'raw-loader',
				exclude: ['./src/index.html']
			}
		],
	},
	plugins: [
		new CopyWebpackPlugin([{
			from: 'src/static',
			to: './static'
		}, ]),
	]
};

module.exports = config;
