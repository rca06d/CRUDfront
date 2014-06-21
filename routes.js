exports.home = function(request, response) {
	response.sendfile('./public/views/index.html');
};