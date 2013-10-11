var baseAddressUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";

window.httpRequest = (function(){
    function getJSON(url){
        var promise = new RSVP.Promise(function(resolve, reject){
            $.ajax({
                url:url,
                type:"GET",
                dataType:"json",
                contentType:"application/json",
                timeout:5000,
                success:function(data){
                    resolve(data);
                },
                error:function(err){
                    reject(err);
                }
            });
        });
        return promise;
    }
    
    function getAddress(lat,long){
        var url = baseAddressUrl + lat+  "," +long + "&sensor=true";
        var promise = getJSON(url);
        return promise;
    }
    
    return {
        getJSON:getJSON,
        getAddress:getAddress
    };    
}());