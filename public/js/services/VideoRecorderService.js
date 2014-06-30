navigator.getUserMedia = navigator.getUserMedia || 
	navigator.webkitGetUserMedia || 
	navigator.mozGetUserMedia || 
	navigator.msGetUserMedia;
//window.MediaRecorder = window.MediaRecorder || MediaStreamRecorder;

VideoApp.factory('videoRecorder', function () {

	// if getUserMedia not supported, return object of empty funcs so it fails gracefully
	if (!(navigator.getUserMedia)) {
		console.log("Video capture not supported.")
		return {
			setMonitor: function() {},
			getMonitor: function() {},
			openCamera: function () {},
			start: function () {},
			stop: function () {},
			getVideoBlob: function() {},
			onVideoAvailable: function() {}
		};
	}

	var monitor = document.createElement("video")
	              .setAttributeNode(document.createAttribute("autoplay"));
	var mediaStream;
	var streamRecorder;
	var videoBlob;

	var self = this;

	var VideoRecorder = {
		setMonitor: function(element) {
			monitor = element;
		},
		getMonitor: function() {
			return monitor;
		},
		openCamera: function() {
			navigator.getUserMedia({video: true, audio: true}, recordInit, function (e) { 
				console.log('Reeeejected!', e); 
			});
		},

		start: function () {

			if (monitor) {
				monitor.src = URL.createObjectURL(mediaStream);
				monitor.play();
			}

		    streamRecorder.start(300000);
		    console.log("Video recorder recording...");
		},

		stop: function () {
		    streamRecorder.stop();
		    console.log("Video recorder stopped.");
		},

		getVideoBlob: function() {
			if(videoBlob) return videoBlob;
		},

		onVideoAvailable: function(video) {
			console.log("Video available");
		}
	};

	function recordInit(localMediaStream) {

		mediaStream = localMediaStream;

		if (monitor) {			
			monitor.src = URL.createObjectURL(mediaStream);
			monitor.play();
		}

		streamRecorder = new MediaStreamRecorder(mediaStream);
	    streamRecorder.mimeType = 'video/webm'; // this line is mandatory
	    streamRecorder.videoWidth  = 640;
	    streamRecorder.videoHeight = 480;
	    
		streamRecorder.ondataavailable = function(blob) {
			videoBlob = blob;
			VideoRecorder.onVideoAvailable(blob);
	    };

	}

	return VideoRecorder;
	
});