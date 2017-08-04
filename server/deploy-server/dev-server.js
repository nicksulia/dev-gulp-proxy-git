var gulp = require("gulp"),
    gutil = require("gulp-util"),
    webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    webpackConfig = require("../../webpack.config");


gulp.task("dev-server", function (callback) {
    var compiler = webpack(webpackConfig);
    new WebpackDevServer(compiler,webpackConfig.devServer).listen(webpackConfig.devServer.port, "localhost", function (err) {});
});