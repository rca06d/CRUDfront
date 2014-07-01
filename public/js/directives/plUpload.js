VideoApp.directive('robPlupload', function () {

	var options = {
		file_data_name: null,
        runtimes: "html5, flash, silverlight, gears, browserplus",
		url: "https://localhost:3001/api/uploadclip",
        max_file_size : '1gb',
        multipart: true,
        flash_swf_url : '/public/scripts/Moxie.swf',
		silverlight_xap_url : '/public/scripts/Moxie.xap',
		init: null
    };

    return {
        scope: {
            file_data_name: "=fileDataName",
			onUploadComplete: "="
        },
        link: function(scope, element, attrs) {

        	options.init = {
        		UploadComplete: scope.onUploadComplete
        	};
        	
        	options.file_data_name = scope.file_data_name;

        	$(element).plupload(options);
        }
    };
});