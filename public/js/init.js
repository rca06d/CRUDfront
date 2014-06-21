(function() {
var app = angular.module("VideoApp", []);

app.directive('robMakeDialog', function() {
    return {
    	scope: {
    		dialogOptions: "=robMakeDialog"
    	},
    	link: function(scope, element, attrs) {

            $(element).dialog(scope.dialogOptions);
        }
    };
});

app.directive('robOpenDialogButton', function() {
    return {
        link: function(scope, element, attrs) {
        	element.click(function() {
        		$("#" + attrs.robOpenDialogButton).dialog( "open" );
        	});        
        }
    };
});

app.directive('robPlupload', function() {
    return {
        link: function(scope, element, attrs) {
        	$(element).plupload({
				runtimes: "html5, flash, silverlight, gears, browserplus",
				file_data_name: attrs.name,
				url: attrs.url,
		        max_file_size : '100mb',
		        multipart: true,
		        flash_swf_url : '/public/scripts/Moxie.swf',
    			silverlight_xap_url : '/public/scripts/Moxie.xap',
    			init: {
	    			BeforeUpload: function(up, file) {
		                // Called right before the upload for a given file starts, can be used to cancel it if required
		                //console.log(file);
		            },
		            UploadComplete: function(up, files) {
		                // Called when all files are either uploaded or failed
		                scope.$parent.getAllAudioClips();
		            }
		        }
			});
        }
    };
});

VideoAppController.$inject = ["$scope", "$http"];

app.controller("VideoAppController", VideoAppController);
})();