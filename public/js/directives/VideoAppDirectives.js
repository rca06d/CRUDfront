function robVideoJS(videoRecorder) {
    return {
        scope: {
            options: "=robOptions",
            videoSrc: "=robVideoSrc",
            recorder: "=robRecorder"
        },
        link: function(scope, element, attrs) {
            var videoJS = videojs(element[0], scope.options, function() {
                // if this player is to be used as an input monitor for the recorder
                if (scope.recorder) {
                    videoRecorder.setMonitor(element[0]);
                    videoRecorder.onVideoAvailable = function(videoBlob) {
                        videoJS.src(URL.createObjectURL(videoBlob));
                    };
                } // end if

                scope.$watch("videoSrc", function(newSrc, oldSrc) {

                    if(newSrc) {

                        newSrc = { src: newSrc, type: getMimeType(newSrc) };

                        videoJS.src(newSrc);
                        videoJS.controls(true);
                    }
                }); // end watch
            });  // end video.js onready callback  
        } // end link
    }; // end return
} // end directive

