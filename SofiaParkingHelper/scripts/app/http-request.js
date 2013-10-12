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
        var result = getJSON(url).then(function(results) {
            //console.log(results.results[0].formatted_address);
            if(results.results && results.results.length > 0){
                //console.log(results.results[0].formatted_address);
                return results.results[0].formatted_address;
            }
            
            return "unknown address";
            })
        //console.log(result);
        
        return result;
    }
    
    return {
        getJSON:getJSON,
        getAddress:getAddress
    };    
}());