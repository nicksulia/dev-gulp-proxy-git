var fs = require('fs');
var path = require('path');
module.exports = {
	context: __dirname,
	entry: "./app.js",
	output:{
        filename: 'bundle.js',
        path: __dirname + "/"
	},
	devServer: {
		port:443,
		https:{
			cert:fs.readFileSync("./cert.crt"),
			key:fs.readFileSync("cert.key")
		},
		contentBase:"./",
		proxy: {
            "/": {
                target:"https://mun-vtlvnux01.showroom.local:8443/",
                secure:false,
                changeOrigin:true,
				bypass:function(req){
                	if (req.url.indexOf("plugins/avid-nux-search-app") !== -1) {
                		return "/dist"+ req.url.slice(req.url.indexOf("plugins/avid-nux-search-app")+27, req.url.length);
					}
				}
            },
            "/ds/": {
                target:"https://mun-vtlvnexidia.showroom.local/ds/",
                secure:false,
                changeOrigin:true
            }
		}
	}
};
