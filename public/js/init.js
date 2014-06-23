(function() {
var app = angular.module("VideoApp", []);

// need to tell the whitelist we want to be able to load stuff from our api domain
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	// Allow same origin resource loads.
	"self",
	// Allow loading from our assets domain. * and ** are wildcards. TODO: look up difference
	"http://localhost:3001/**"]);
});

app.directive('robMakeDialog', robMakeDialog);

app.directive('robOpenDialogButton', robOpenDialogButton);

app.directive('robPlupload', robPlupload);

app.factory("$videoRecorder", VideoRecorderFactory);

VideoAppController.$inject = ["$scope", "$http", "$videoRecorder"];

app.controller("VideoAppController", VideoAppController);
})();