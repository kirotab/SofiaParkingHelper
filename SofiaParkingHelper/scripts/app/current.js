var app = app || {};

(function(a) {
   
    function startWatchingGeolocation() {
        navigator.geolocation.watchPosition(geoWatchSuccess, geoWatchError, {
            enableHighAccuracy: true,
            maximumAge: 50
        });
    }

    function geoWatchSuccess(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var heading = position.coords.heading;

        var mapsBaseUrl = "http://maps.googleapis.com/maps/api/staticmap";
        var centerPar = "center=" + lat + "," + long;
        var sizePar = "size=600x600";

        //var arrow = document.getElementById("arrow");
        var displayPosition = document.getElementById("displayPosition");
        displayPosition.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + "&" + "&sensor=true&zoom=15";
        displayPosition.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
        //arrow.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
        viewModel.set("currentPoint", position);
        viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(position));
    }

    function geoWatchError(error) {
        alert("error " + error)
    }
    
    
    
    var viewModel = kendo.observable({
        currentPoint:{"coords":{"latitude":0,"longitude":0}},
        test:"views/parking-view.html#parking-view",
        startWatchingGeolocation: startWatchingGeolocation
    });
    
    function init(e) {
        startWatchingGeolocation();
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.current = {
        init:init          
    };
}(app));