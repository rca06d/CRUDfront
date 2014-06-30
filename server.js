var express = require("express");

var app = express();

app.use(express.static('./public'));

// Routes
require("./routes")(app);

var server = app.listen(3000, function() { 
	console.log("Here's my port number: %d, call me maybe?", server.address().port);
});