VideoApp.controller('VideoAppController', function($scope, $http, videoRecorder, speechRecognizer) {

	var apiServer = "http://localhost:3001/api/";
	var vm = this;

	//------------- data ------------------------//

	vm.clips = [];
	vm.selectedClip = {};
	vm.recordedVideo = false;
	vm.transcript = "";
	vm.videoPlayerTemplate = "views/videohtml5.html";
	vm.recordMode = false;

	vm.editDialogButtons = {
        "Save": function() {
        	vm.updateCurrentClip();
        	$( this ).dialog( "close" );
        },
        Cancel: function() {
        	$( this ).dialog( "close" );
        }
	};

	$scope.$watch('vm.selectedClip', function(newVal, oldVal) {
		vm.recordMode = false;
		vm.recordedVideo = false;
		if (getMimeType(newVal.clientPath) == "video/flv") vm.videoPlayerTemplate = "views/videoflash.html";
		else vm.videoPlayerTemplate = "views/videohtml5.html";
	});

	videoRecorder.onVideoAvailable = function(videoBlob) {

		if (vm.recordMode) {
			$scope.$apply(function() {
				vm.recordedVideo = videoBlob;
			});	
			vm.selectedClip.name = "video" + genDateString() + ".webm";	
			videoRecorder.getMonitor().src = URL.createObjectURL(videoBlob);
		}

	};

	speechRecognizer.onTranscriptComplete = function(transcript) {
		if (vm.recordMode) {
			vm.selectedClip.transcript = transcript;
		}
	};

	//------------- private methods -------------------//

	var uniqid = (function() {
		// increment with date ensures collision impossibility in this client instance
        var i = 0;
        return function() {
        	// date ensures collision impossibility unless two files created in same millisecond (theoretically, but not really)
            var d = new Date();
            // random number reduces collision chances further
            var rand = Math.round(Math.random() * 100000000);
            return d.valueOf().toString() + i++ + rand.toString();
        };
    })();

    function genDateString() {
		var d = new Date();
		return d.getFullYear() + "_" + (d.getMonth()+1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds() + "_" + d.getMilliseconds();
	}

	function getMimeType(url) {
		if(!url) return false;
    	var extension = url.split(".").pop();

    	switch (extension) {
	    case "mp4":
	        return "video/mp4";
	    case "webm":
	        return "video/webm";
	    case "ogv":
	        return "video/ogg";
	    case "mov":
	        // TODO: figure out why this doesn't work as video/quicktime and DOES work as video/webm
	        return "video/webm";
	    case "flv":
	        return "video/flv";
	    case "wmv":
	        return "video/x-ms-wmv";
	    case "avi":
	        return "video/x-msvideo";
	    case "m3u8":
	        return "video/x-mpegURL";
	    case "ts":
	        return "video/MP2T";
	    case "3gp":
	        return "video/3gpp";
	    case undefined:
	        console.log("Video source is undefined!");
	        return false;
	    default:
	        console.log("Video source could not be associated with a mime type"); 
	        return false;
	    }
	}

	function uploadToServer(file, fileName) {

		var fd = new FormData();

		fd.append("fileUpload", file, fileName);

		return $http.post("http://localhost:3001/api/uploadclip", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .error(function(data, status, headers, config) {
            alert("Clip upload failed!");
        });
	};

	function updateClip(model) {
		return $http.put(apiServer + "updateclip", model)
		.error(function(data, status, headers, config) {
            alert("Clip update failed!");
        });
	}

	//------------- behaviors -------------------//	

	vm.saveVideo = function() {
		// begin uploading the file
		uploadToServer(vm.recordedVideo, vm.selectedClip.name)
		// if the file succeeds we need to send the transcript and any other data to its database entry
		.success(function(response, status, headers, config) {

			console.log("File uploaded successfully: ");
            console.log(response);

			updateClip(vm.selectedClip)
			.success(function(response, status, headers, config) {
				console.log("Transcript saved: ");
            	console.log(response);
				vm.getAllClips();    
	        });
        });
	}

	vm.recordButtonClick = function() {
		vm.recordMode = true;
		speechRecognizer.setMonitor(document.getElementById("selectedTranscript"));
		videoRecorder.setMonitor(document.getElementById("videoMainWindow"));
		videoRecorder.openCamera();
	};

	vm.onPlayerChange = function(template) {
		console.log(template);
	};

	vm.startRecording = function() {
		videoRecorder.start();
		speechRecognizer.start();
	};

	vm.stopRecording = function() {
		speechRecognizer.stop();
		videoRecorder.stop();
	};

	vm.getAllClips = function() {
        $http.get(apiServer + "getallclips")
        .success(function(data) {
            vm.clips = data;
            vm.selectedClip = vm.clips[0] || {};
        });
    };

    vm.updateCurrentClip = function() {
    	updateClip(vm.selectedClip)
    	.success(function(data) {
            vm.getAllClips();
        });
    };

    vm.deleteClip = function() {
    	$http.delete(apiServer + "deleteclip/" + vm.selectedClip._id).success(function(success) {
            if (success) vm.getAllClips();
        });
    };

    // ----------------- Init ----------------------//

    vm.getAllClips();

});