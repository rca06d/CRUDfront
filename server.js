var express = require("express");
var routes = require("./routes.js");

var app = express();

app.use(express.static('./public'));

// Routes
app.get("/", routes.home);

var server = app.listen(3000, function() { 
	console.log("Here's my port number: %d, call me maybe?", server.address().port);
});