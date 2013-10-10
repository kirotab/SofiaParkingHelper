var app = app || {};

(function() {
    
    document.addEventListener("deviceready", function() {
        //app.servicesBaseUrl = "http://localhost:62354/api/";
        app.servicesBaseUrl = "http://the-places.apphb.com/api/";
        
        var kendoApp = new kendo.mobile.Application(document.body);
    });    
}());


(function (global) {
    var mobileSkin = "",
        app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
    }, false);

    app.changeSkin = function (e) {
        if (e.sender.element.text() === "Flat") {
            e.sender.element.text("Native");
            mobileSkin = "flat";
        }
        else {
            e.sender.element.text("Flat");
            mobileSkin = "";
        }

        app.application.skin(mobileSkin);
    };
})(window);