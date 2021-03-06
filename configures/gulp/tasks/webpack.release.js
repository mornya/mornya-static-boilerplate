import gulp from 'gulp';
import webpackGlobal from 'webpack';
import webpackStream from 'webpack-stream';
import path from 'path';
import fromJSON from '../functions/fromJSON';
import props from '../gulp-props.config';

const webpackConfig = {
	devtool: '#inline-source-map',
	entry: fromJSON(path.resolve('.jsentryrc')),
	output: {
		path: path.resolve('server/webroot/assets/js/'),
		filename: '[name].js',
		publicPath: '/assets/js/'
	},
	resolve: {
		extensions: ['.js'],
		modules: [props.SRC.JS, './node_modules']
	},
	watch: false,
	module: {
		loaders: [
			{
				test: /\.scss/,
				loader: 'style-loader!css-loader!sass-loader'
			},
			{
				test: /\.css/,
				loader: 'style-loader!css-loader'
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					cacheDirectory: true,
					presets: ['es2015']
				}
			}
		]
	},
	plugins: [
		new webpackGlobal.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};

gulp.task('webpack:release', () => {
	return gulp.src([`${props.SRC.JS}/**/*.js`, `!${props.SRC.JS}/__INCLUDES__`])
		.pipe(webpackStream(webpackConfig, webpackGlobal, (err, stats) => {
			if (err) {
				throw err;
			} else {
				console.info('[webpack]', stats.toString({
					chunks: false,
					colors: true
				}));
			}
		}))
		.pipe(gulp.dest(props.DEST.JS));
});
