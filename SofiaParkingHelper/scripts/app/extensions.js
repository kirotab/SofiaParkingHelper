var cordovaExt = (function() {
    function getLocation() {
        var promise = new RSVP.Promise(function(resolve, reject) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    resolve(position);
                }, function(err) {
                    reject(err);
                });
        });
        return promise;
    }
    
    function isWithinPoly(lookupPos, polygon){
        var lookupPosAsLatLng = new google.maps.LatLng(lookupPos.coords.latitude,lookupPos.coords.longitude);
        var isWithinPolygon = google.maps.geometry.poly.containsLocation(lookupPosAsLatLng, polygon);
        console.log(isWithinPolygon);
        return isWithinPolygon;
}
    
    return {
        getLocation: getLocation,
        isWithinPoly:isWithinPoly
    }
}());