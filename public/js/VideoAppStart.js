var VideoApp = angular.module("VideoApp", []);

// need to tell the whitelist we want to be able to load stuff from our api domain
VideoApp.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
	// Allow same origin resource loads.
	"self",
	// Allow loading from our assets domain. * and ** are wildcards. TODO: look up difference
	"http://localhost:3001/**"]);
});