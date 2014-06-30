VideoApp.directive('robFlashVideo', function () {
    return {
        scope: {
            videoSrc: "=robVideoSrc"
        },
        link: function(scope, element, attrs) {

            var flashvars = { 
                movie: scope.videoSrc,
                btncolor: "0x333333",
                accentcolor: "0x31b8e9",
                txtcolor: "0xEEEEEE",
                autoload: "on",
                autoplay: "off",
                Title: "Haiiii",
                showTitle: "yes"
            };

            var params = { }; // flashvars param will automatically be added, so this is for other stuff 

            swfobject.embedSWF("flash/osflv/OSplayer.swf", attrs.id, attrs.width, attrs.height, "11.2", "js/lib/swfobject/expressInstall.swf", flashvars, params);
        }
    };
});