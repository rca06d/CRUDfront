VideoApp.directive('robRecorderControls', function (videoRecorder, speechRecognizer) {

	return {
        link: function(scope, element, attrs) {

        	element.on("click", function() {

                var state = element.html();

                if (state == "Record") {
                    element.html("Stop");
                    videoRecorder.start();
                } else {
                    element.html("Record");
                    videoRecorder.stop();
                }
                
            });
        }
    };
});