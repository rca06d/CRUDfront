VideoApp.directive('robMakeDialog', function () {

    var options = {
        appendTo: null, 
        autoOpen: null,
        buttons: null,
        closeOnEscape: null,
        closeText: null,
        dialogClass: null,
        draggable: null,
        height: null,
        width: null,
        hide: null,
        maxHeight: null,
        maxWidth: null,
        minHeight: null,
        minWidth: null,
        modal: null,
        position: null,
        resizable: null,
        show: null,
        title: null,
        // events
        open: null,
        close: null
    };

    return {
    	scope: {
            appendTo: "@", // "#someElement"
            autoOpen: "=", // bool
            buttons: "=", // {}
            closeOnEscape: "=", // bool
            closeText: "@", // "" text for close button
            dialogClass: "@", // "className"
            draggable: "=", // bool
            height: "=", // 460
            width: "=", // 240
            hide: "=", // bool OR {}
            maxHeight: "=", // 460
            maxWidth: "=", // 240
            minHeight: "=", // 300
            minWidth: "=", // 200
            modal: "=", // bool
            position: "=", // {}
            resizable: "=", // bool
            show: "=", // bool OR {}
            title: "@", // ""
            // events
            open: "=", // function
            close: "=", // function
            openDialogButton: "@robOpenDialogButton"
    	},
    	link: function(scope, element, attrs, controller) {

            for (var prop in options) options[prop] = options[prop] || scope[prop];
            
            $(element).dialog(options);

            $("#" + scope.openDialogButton).on("click", function() {
                $(element).dialog( "open" );
            }); 
        }
    };
});