window.SpeechRecognition = window.SpeechRecognition || 
	window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition ||
    window.oSpeechRecognition;

VideoApp.factory('speechRecognizer', function () {

	// if speech recognition not supported, return object of empty funcs so it fails gracefully
	if (!(window.SpeechRecognition)) {
		console.log("Speech Recognition not supported.")
		return {
			start: function () {},
			stop: function () {},
			onInterimResult: function() {},
			onFinalResult: function() {}
		};
	}

	var recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

	var finalTranscript = "";
	var monitor;

	var self = this;

	var SpeechRecognizer = {
		setMonitor: function(element) {
			monitor = element;
		},
		getMonitor: function() {
			return monitor;
		},
		getTranscript: function() {
			return finalTranscript;
		},
		start: function () {
		    finalTranscript = "";
			recognition.lang = "en-US";
			recognition.start();
		    console.log("Speech Recognizer listening...");
		},

		stop: function () {
		    recognition.stop();
		    console.log("Speech Recognizer stopped.");
		},

		onTranscriptComplete: function(transcript) {
			console.log("Speech recognition transcript: " + transcript);
		}
	};

	recognition.onstart = function() { 
		finalTranscript = "";
	};

	recognition.onresult = function(event) { 
		var interimTranscript = "";

		for (var i = event.resultIndex; i < event.results.length; ++i) {
			if (event.results[i].isFinal) {
				finalTranscript += event.results[i][0].transcript;
				if (monitor) monitor.innerHTML = finalTranscript;
			} else {
				interimTranscript += event.results[i][0].transcript;
				if (monitor) monitor.innerHTML = interimTranscript;
			}
		}	
		//final_transcript = capitalize(final_transcript);
		//final_span.innerHTML = linebreak(final_transcript);
		//interim_span.innerHTML = linebreak(interim_transcript);
	};

	recognition.onerror = function(event) { 

		var err = "";

		switch (event.error) {
			case "no-speech":
				err = "No speech was detected.";
				break;
			case "aborted":
				err = "Speech input was aborted.";
				break;
			case "audio-capture":
				err = "Audio capture failed.";
				break;
			case "network":
				err = "Some network communication that was required to complete the recognition failed.";
				break;
			case "not-allowed":
				err = "The user agent is not allowing any speech input to occur for reasons of security, privacy or user preference.";
				break;
			case "service-not-allowed":
				err = "The user agent is not allowing the web application requested speech service, but would allow some speech service, to be used either because the user agent doesn't support the selected one or because of reasons of security, privacy or user preference.";
				break;
			case "bad-grammar":
				err = "There was an error in the speech recognition grammar or semantic tags, or the grammar format or semantic tag format is unsupported.";
				break;
			case "language-not-supported":
				err = "The language was not supported.";
				break;
			default:
				err = "Error not recognized.";
		}

		console.log("Eeek! Speech recognition error: " + err);
	};

	recognition.onend = function() { 
		if (finalTranscript == "") finalTranscript = "[silence]";
		if (monitor) monitor.innerHTML = finalTranscript;
		SpeechRecognizer.onTranscriptComplete(finalTranscript);
		console.log("Speech recognition done");
	};

	return SpeechRecognizer;
	
});