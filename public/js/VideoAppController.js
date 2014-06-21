navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var VideoAppController = function($scope, $http) {

	var video;
	var mediaStream;
	var streamRecorder;
	var videoBlob;

	navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
		video = document.getElementById("videoRecordWindow");

		mediaStream = localMediaStream;

		video.controls = true;
		video.src = URL.createObjectURL(mediaStream);

		streamRecorder = new MediaStreamRecorder(mediaStream);
	    streamRecorder.mimeType = 'video/webm'; // this line is mandatory
		streamRecorder.ondataavailable = function(blob) {
			video.src = URL.createObjectURL(blob);
			videoBlob = blob;
	        video.play();
	    };

	}, function() { console.log('Reeeejected!', e); });

	//------------- data ------------------------//

	$scope.clips = [];
	$scope.selectedClip = {};

	$scope.$watch("selectedClip", function(newValue, oldValue) {
		var videoMain = document.getElementById("videoMainWindow");
		videoMain.src = newValue.clientPath;
	});

	$scope.dialogOptions = {
		record: { 
			modal: true, 
			autoOpen: false,
			width: 670,
			height: 600,
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
};