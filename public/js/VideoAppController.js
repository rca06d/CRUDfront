navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var VideoAppController = function($scope, $http) {

	var video;
	var mediaStream;
	var streamRecorder;
	var videoBlob;

	function recordInit(localMediaStream) {
		video = document.getElementById("videoRecordWindow");

		mediaStream = localMediaStream;

		video.controls = true;
		video.src = URL.createObjectURL(mediaStream);

		streamRecorder = new MediaStreamRecorder(mediaStream);
	    streamRecorder.mimeType = 'video/webm'; // this line is mandatory
	    streamRecorder.videoWidth  = 640;
        streamRecorder.videoHeight = 480;
		streamRecorder.ondataavailable = function(blob) {
			video.src = URL.createObjectURL(blob);
			videoBlob = blob;
	        video.play();
	    };

	}

	function permissionDenied() { 
		console.log('Reeeejected!', e); 
	}

	//------------- data ------------------------//

	$scope.clips = [];
	$scope.selectedClip = {};

	$scope.dialogOptions = {
		record: { 
			modal: true, 
			autoOpen: false,
			width: 670,
			height: 600,
			open: function() {
				navigator.getUserMedia({video: true, audio: true}, recordInit, permissionDenied);
			}
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
		        	$scope.updateClip();
		        	$( this ).dialog( "close" );
		        },
		        Cancel: function() {
		        	$( this ).dialog( "close" );
		        }
	    	}
		}
	};

	//------------- behaviors -------------------//	

	$scope.startRecording = function () {	
	    streamRecorder.start(300000);
	    console.log("recording");
	};

	$scope.stopRecording = function () {
	    streamRecorder.stop();
	    console.log("stopped");
	};

	$scope.uploadToServer = function () {

		var d = new Date();
		var dateStr = d.getFullYear() + "_" + (d.getMonth()+1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds() + "_" + d.getMilliseconds();

		var fd = new FormData();
		fd.append("video_file", videoBlob, "video" + dateStr + ".webm");

		$http.post("http://localhost:3001/api/uploadclip", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
		.success(function(data, status, headers, config) {
            console.log("success");
            $scope.getAllClips();
        })
        .error(function(data, status, headers, config) {
            alert("AJAX failed!");
        });
	};

	var apiServer = "http://localhost:3001/api/";

	$scope.getAllClips = function() {
        $http.get(apiServer + "getallclips").success(function(data) {
            $scope.clips = data;
            $scope.selectedClip = $scope.clips[0] || {};
        });
    };

    $scope.updateClip = function() {
    	$http.put(apiServer + "updateclip/" + $scope.selectedClip._id, $scope.selectedClip).success(function(data) {
            $scope.getAllClips();
        });
    };

    $scope.deleteClip = function() {
    	$http.delete(apiServer + "deleteclip/" + $scope.selectedClip._id).success(function(success) {
            if (success) $scope.getAllClips();
        });
    };

};