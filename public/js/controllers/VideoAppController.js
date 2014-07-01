VideoApp.controller('VideoAppController', function($scope, $http, videoRecorder, speechRecognizer) {

	// base location for all the api calls
	var apiServer = "https://localhost:3001/api/";
	var vm = this;

	//------------- data ------------------------//

	// stores all the clips that vm.getAllClips() returns from mongo
	vm.clips = [];
	// the currently selected clip. Determined by the "SelectedClip" select element
	vm.selectedClip = {};
	// used to switch between html5 and flash video players
	vm.videoPlayerTemplate = "views/videohtml5.html";
	// bool used to show or hide record controls
	vm.recordMode = false;
	// stores the video blob returned by videoRecorder
	vm.recordedVideoBlob = false;
	// database model for the recorded video
	vm.recordedVideoModel = {};

	// callbacks to be called on clicking the buttons in the edit dialog
	vm.editDialogButtons = {
        "Save": function() {
        	updateClip(vm.selectedClip)
	    	.success(function(data) {
	            vm.getAllClips();
	        });
        	$( this ).dialog( "close" );
        },
        Cancel: function() {
        	$( this ).dialog( "close" );
        }
	};

	// several things need to occur each time the user selects a different video
	$scope.$watch('vm.selectedClip', function(newVal, oldVal) {
		// a change to selected clip means someone clicked the select box and is not recording anymore
		vm.recordMode = false;
		// also want to not show the "Save Video" button any more, so we need to forget the video
		vm.recordedVideoBlob = false;

		// this is where we swap players if the new videos mime type is a flash type
		// TODO: make this aware of the browser as well
		if (newVal.mimeType == "video/flv") vm.videoPlayerTemplate = "views/videoflash.html";
		else vm.videoPlayerTemplate = "views/videohtml5.html";
	});

	// this is fired if the user says "allow" to camera prompt
	videoRecorder.onPermissionGranted = function() {
		$scope.$apply(function() {
			vm.recordMode = true;
		});	
	};

	// fired if the user says nope
	videoRecorder.onPermissionDenied = function(e) {
		console.log('Reeeejected!', e);
	};

	// fired when the recorded has a video blob ready for us
	videoRecorder.onVideoAvailable = function(videoBlob) {
		$scope.$apply(function() {
			vm.recordedVideoBlob = videoBlob;
		});	
		vm.recordedVideoModel.name = "video" + genDateString() + ".webm";	
		videoRecorder.getMonitor().src = URL.createObjectURL(videoBlob);
	};

	// fired when the speech recognizer has a final transcript ready
	speechRecognizer.onTranscriptComplete = function(transcript) {
		vm.recordedVideoModel.transcript = transcript;
	};

	//------------- private methods -------------------//

	// this is not used currently, but probably should be instead of the date function below
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

    // makes a big long string with the date. For getting a semi-unique file name
    function genDateString() {
		var d = new Date();
		return d.getFullYear() + "_" + (d.getMonth()+1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds() + "_" + d.getMilliseconds();
	}

	// simple file upload to server using FormData
	function uploadToServer(file, fileName) {

		var fd = new FormData();

		fd.append("fileUpload", file, fileName);

		// didn't find a great explanation of why this weirdness works, but it does somehow
		return $http.post(apiServer + "uploadclip", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .error(function(data, status, headers, config) {
            alert("Clip upload failed!");
        });
	};

	// hopefully self explanatory
	function updateClip(model) {
		return $http.put(apiServer + "updateclip", model)
		.error(function(data, status, headers, config) {
            alert("Clip update failed!");
        });
	}

	//------------- behaviors -------------------//	

	// TODO: make this cooler
	vm.saveVideo = function() {
		// begin uploading the file
		uploadToServer(vm.recordedVideoBlob, vm.recordedVideoModel.name)
		// if the file succeeds we need to send the transcript and any other data to its database entry
		.success(function(model, status, headers, config) {

			console.log("File uploaded successfully: ");

			// i don't like this, but its probably the best way
            model.transcript = vm.recordedVideoModel.transcript;

			updateClip(model)
			.success(function(success, status, headers, config) {
				console.log("Transcript saved!");
				// reset recorded video stuff for next recording
				vm.recordedVideoBlob = false;
				vm.recordedVideoModel = {};
				// reload the clips to display the new video in the select element
				vm.getAllClips();    
	        });
        });
	}

	// Called when the "Record A Video" button is clicked
	vm.recordModeInit = function() {
		// clear any selected clip data out
		vm.recordedVideoModel = {};
		// give the speech recognizer a place to spit out its transcription
		speechRecognizer.setMonitor(document.getElementById("selectedTranscript"));
		// give the video recorder a place to show what its recording
		videoRecorder.setMonitor(document.getElementById("videoMainWindow"));
		// ask user for permission to use web cam, and turn it on
		videoRecorder.openCamera();
	};

	vm.getAllClips = function() {
        $http.get(apiServer + "getallclips")
        .success(function(data) {
            vm.clips = data;
            vm.selectedClip = vm.clips[0] || {};
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