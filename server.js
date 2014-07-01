var express = require("express");
var https = require("https");
var fs = require("fs");

var app = express();

app.use(express.static('./public'));

// Routes
require("./routes")(app);

var options = {
	key: fs.readFileSync('keys/privatekey.pem'),
	cert: fs.readFileSync('keys/certificate.pem')
};

var server = https.createServer(options, app).listen(3000, function() { 
    console.log("Here's my number: %d, call me maybe?", server.address().port);
});