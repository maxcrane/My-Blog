var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require('copy-webpack-plugin');


var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
	entry: SRC_DIR + "/app/index.jsx",
	output: {
		path : DIST_DIR + "/app",
		filename : "bundle.js",
		publicPath : "/app/"
	},
	module: {
		loaders : [
			{
				test : /\.jsx?/,
				include : SRC_DIR,
				loader : "babel-loader",
				query : {
					presets : ["react", "es2015", "stage-2"]
				} 
			},
			{
				test : /\.css$/,
				loader : "style-loader!css-loader"
			}
		]
	},
	devServer: {
	    proxy: {
            '/api/**': {
                target: 'http://localhost:3000/',
                secure: false,
                changeOrigin: true
            }
        }
  	},
  	context: SRC_DIR,
  	plugins: [
        new CopyWebpackPlugin([
            { 
              from: 'images',
              to:  path.resolve(DIST_DIR, "images") 
          	},
          	{
          		from: 'index.html',
          		to: path.resolve(DIST_DIR, 'index.html')
          	}
        ])
    ]
};

module.exports = config;
