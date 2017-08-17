var gulp = require("gulp");
var fs = require('fs');
var path = require('path');

gulp.task("svg-converter", function () {
    var pathRoot = path.resolve(__dirname, "../../");
    var pathSVG = path.resolve(pathRoot, "./svg/symbols/");
    var pathStylesheet = path.resolve(pathRoot, "./iconsSVG.less");
    fs.access(pathStylesheet, function (err) {
        if(err) {
            fs.writeFileSync(pathStylesheet,"",'utf8');
        }
        var dataSVG = fs.readFileSync(pathStylesheet,'utf8');
        fs.readdirSync(pathSVG).forEach(function (item) {
            var data = fs.readFileSync(path.join(pathSVG, item));
            var name = item.split('.')[0];
            if (dataSVG.indexOf('@'+ name) > -1) {
                dataSVG = dataSVG.replace(new RegExp("(@"+name+":\s)[^;]*(;)"), "$1"+ encodeOptimizedSVGDataUri(data)+ "$2");
            } else {
                var pair = '@'+ name + ': ' + encodeOptimizedSVGDataUri(data) + ';\n';
                dataSVG += pair;
            }
        });
        fs.writeFileSync(pathStylesheet,dataSVG,'utf8');
    });
});

function encodeOptimizedSVGDataUri(svgString) {
    var uriPayload = encodeURIComponent(svgString) // encode URL-unsafe characters
        .replace(/%0A/g, '') // remove newlines
        .replace(/%20/g, ' ') // put spaces back in
        .replace(/%3D/g, '=') // ditto equals signs
        .replace(/%3A/g, ':') // ditto colons
        .replace(/%2F/g, '/') // ditto slashes
        .replace(/%22/g, "'"); // replace quotes with apostrophes (may break certain SVGs)

    return 'url("data:image/svg+xml,' + uriPayload +'")';
}