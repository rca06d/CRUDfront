navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
//window.MediaRecorder = window.MediaRecorder || MediaStreamRecorder;

var VideoRecorderFactory = function () {

	var video;
	var mediaStream;
	var streamRecorder;
	var videoModel = {};
	var videoBlob;

	var self = this;

	var VideoRecorder = {
		getUserMedia: function() {
			navigator.getUserMedia({video: true, audio: true}, recordInit, permissionDenied);
		},

		start: function () {	
		    streamRecorder.start(300000);
		    final_transcript = '';
			recognition.lang = "en-US";
			recognition.start();
		    console.log("recording");
		},

		stop: function () {
		    streamRecorder.stop();
		    recognition.stop();
		    videoModel.name = "video" + genDateString() + ".webm";
		    console.log("stopped");
		},

		getVideoBlob: function() {
			return videoBlob;
		},

		getVideoModel: function() {
			return videoModel;
		},

		onInterimResult: function(result) { console.log(result); },
		onFinalResult: function(result) { console.log(result); }
	};

	function genDateString() {
		var d = new Date();
		return d.getFullYear() + "_" + (d.getMonth()+1) + "_" + d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds() + "_" + d.getMilliseconds();
	}	

	function permissionDenied() { 
		console.log('Reeeejected!', e); 
	}

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

	//------------- Speech recognition ----------------//

	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() { 
		videoModel.transcript = "";
	};

	recognition.onresult = function(event) { 
		var interim_transcript = "";

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				videoModel.transcript += event.results[i][0].transcript;
				VideoRecorder.onFinalResult(videoModel.transcript);
			} else {
				interim_transcript += event.results[i][0].transcript;
				VideoRecorder.onInterimResult(interim_transcript);
			}
		}	
		//final_transcript = capitalize(final_transcript);
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
	};

	recognition.onerror = function(event) { 
		console.log("eek error with speech recognition:");
		console.log(event);
	};

	recognition.onend = function() { 
		if (videoModel.transcript == "") videoModel.transcript = "[silence]";
		console.log("speech recognition done");
	};

	return VideoRecorder;
	
};