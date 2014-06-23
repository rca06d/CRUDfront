var VideoAppController = function($scope, $http, $videoRecorder) {

	var apiServer = "http://localhost:3001/api/";

	//------------- data ------------------------//

	$scope.clips = [];
	$scope.selectedClip = {};
	$scope.transcript = "";

	$videoRecorder.onInterimResult = function(result) {
		$scope.$apply(function() {
			$scope.transcript = result;
		});
	};

	$videoRecorder.onFinalResult = function(result) {
		$scope.$apply(function() {
			$scope.transcript = result;
		});
	};

	//------------- dialogs ---------------------//

	$scope.dialogOptions = {
		record: { 
			modal: true, 
			autoOpen: false,
			width: 670,
			height: 600,
			open: $videoRecorder.getUserMedia
		},
		upload: { 
			modal: true, 
			autoOpen: false,
			width: 600,
			height: 450
		},
		edit: { 
			modal: true, 
			autoOpen: false,
			width: 400,
			height: 250,
			buttons: {
		        "Save": function() {
		        	$scope.updateCurrentClip();
		        	$( this ).dialog( "close" );
		        },
		        Cancel: function() {
		        	$( this ).dialog( "close" );
		        }
	    	}
		}
	};

	//------------- private methods -------------------//

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

	$scope.startRecording = $videoRecorder.start;

	$scope.stopRecording = $videoRecorder.stop;

	// upload a video after recording it
	$scope.uploadRecordedVideo = function () {

		// get the video blob from the recorder
		var videoBlob = $videoRecorder.getVideoBlob();
		// make a unique file name. TODO: make server do this probably?
		var videoModel = $videoRecorder.getVideoModel();

		// begin uploading the file
		uploadToServer(videoBlob, videoModel.name)
		// if the file succeeds we need to send the transcript and any other data to its database entry
		.success(function(response, status, headers, config) {
            console.log("File uploaded successfully.");

            response.transcript = videoModel.transcript;

            updateClip(response)
	    	.success(function(data) {
	            $scope.getAllClips();
	        });

        });
	};		

	$scope.getAllClips = function() {
        $http.get(apiServer + "getallclips")
        .success(function(data) {
            $scope.clips = data;
            $scope.selectedClip = $scope.clips[0] || {};
        });
    };

    $scope.updateCurrentClip = function() {
    	updateClip($scope.selectedClip)
    	.success(function(data) {
            $scope.getAllClips();
        });
    };

    $scope.deleteClip = function() {
    	$http.delete(apiServer + "deleteclip/" + $scope.selectedClip._id).success(function(success) {
            if (success) $scope.getAllClips();
        });
    };

};