module.exports = function(app) {

	app.get("/", function(request, response) {
		response.sendfile('./public/views/index.html');
	});
	
};