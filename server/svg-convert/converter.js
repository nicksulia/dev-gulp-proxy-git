var gulp = require("gulp");
var fs = require('fs');
var path = require('path');

gulp.task("svg-converter", function () {
    var pathRoot = path.resolve(__dirname, "../../");
    var pathSVG = path.resolve(pathRoot, "./svg/symbols/");
    var pathSvgStylesheet = path.resolve(pathRoot, "./nx-iconsSVG.less");
    var pathSvgMixinsStylesheet = path.resolve(pathRoot, "./nx-mixinsSVG.less");
    var names = [];
    fs.access(pathSvgStylesheet, function (err) {
        if(err) {
            fs.writeFileSync(pathSvgStylesheet,"",'utf8');
        }
        var dataSVG = fs.readFileSync(pathSvgStylesheet,'utf8');
        fs.readdirSync(pathSVG).forEach(function (item) {
            var data = fs.readFileSync(path.join(pathSVG, item));
            var name = item.split('.')[0];
            names.push(name);
            if (dataSVG.indexOf('@'+ name) > -1) {
                dataSVG = dataSVG.replace(new RegExp("(@"+name+":\s)[^;]*(;)"), "$1"+ encodeOptimizedSVGDataUri(data)+ "$2");
            } else {
                var pair = '@'+ name + ': ' + encodeOptimizedSVGDataUri(data) + ';\n';
                dataSVG += pair;
            }
        });
        fs.writeFileSync(pathSvgStylesheet,dataSVG,'utf8');
    });
    fs.access(pathSvgMixinsStylesheet, function (err) {
        if(err) {
            fs.writeFileSync(pathSvgMixinsStylesheet,"@import 'nx-iconsSVG.less';\n\n", 'utf8')
        }
        var svgMixinsData = fs.readFileSync(pathSvgMixinsStylesheet, 'utf8');
        var updatedSvgMixinsData = createSvgMixinsStylesheet(names, svgMixinsData);
        fs.writeFileSync(pathSvgMixinsStylesheet,updatedSvgMixinsData,'utf8');
    });
});

function createSvgMixinsStylesheet(names, data) {
    var formattedData = data;
    names.forEach(function (name) {
        if (formattedData.indexOf('@'+name) === -1) {
            formattedData += "." + name + " {\n";
            formattedData += "-webkit-mask-image: @" + name + ";\n";
            formattedData += "mask-image: @" + name + ";\n";
            formattedData += "}\n";
        }
    });
    return formattedData;
}

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