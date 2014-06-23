function robMakeDialog() {
    return {
    	scope: {
    		dialogOptions: "=robMakeDialog"
    	},
    	link: function(scope, element, attrs) {

            $(element).dialog(scope.dialogOptions);
        }
    };
}

function robOpenDialogButton() {
    return {
        link: function(scope, element, attrs) {
        	element.click(function() {
        		$("#" + attrs.robOpenDialogButton).dialog( "open" );
        	});        
        }
    };
}

function robPlupload() {
    return {
        link: function(scope, element, attrs) {
        	$(element).plupload({
				runtimes: "html5, flash, silverlight, gears, browserplus",
				file_data_name: attrs.name,
				url: attrs.url,
		        max_file_size : '1gb',
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
		                scope.$parent.getAllClips();
		            }
		        }
			});
        }
    };
}