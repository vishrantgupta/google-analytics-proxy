var express = require("express"), 
proxy = require("express-http-proxy"), app = express();

app.use(express.static(__dirname)); // serve static files from cwd

function getIpFromReq (req) { // get the client's IP address
	var bareIP = ":" + ((req.connection.socket && req.connection.socket.remoteAddress)
		|| req.headers["x-forwarded-for"] || req.connection.remoteAddress || "");
	return (bareIP.match(/:([^:]+)$/) || [])[1] || "127.0.0.1";
}

// proxying requests from /analytics to www.google-analytics.com.
app.use("/analytics", proxy("www.google-analytics.com", {
	proxyReqPathResolver: function (req) {
		return req.url + (req.url.indexOf("?") === -1 ? "?" : "&")
			+ "uip=" + encodeURIComponent(getIpFromReq(req));
	}
}));

app.listen(8080);
console.log("Listening on port 8080");
