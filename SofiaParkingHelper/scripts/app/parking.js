var app = app || {};

(function(a) {
   
    
    function setParkingPoint() {
        cordovaExt.getLocation().
        then(function(location) {
            //var locationString = location.coords.latitude + "," + location.coords.longitude;            
            return location;   
        })
        .then(function(point) {
            //viewModel.set("parkingPoint", {"lat": point.coords.latitude, "long": point.coords.longitude}); 
            viewModel.set("parkingPoint", point); 
            console.log(point);
        });
    }
    
    function getParkingPoint() {
        console.log(viewModel.parkingPoint);
        return viewModel.parkingPoint;
    }
    
    var viewModel = kendo.observable({
        //parkingPoint:{"lat":0,"long":0},
        parkingPoint:{"coords":{"latitude":0,"longitude":0}},
        setParkingPoint: setParkingPoint,
        getParkingPoint: getParkingPoint
    });
    
    function init(e) {
        //setParkingPoint();
        //console.log(e.view);
        //viewModel.set("parkingPoint", {"coords":{"latitude": e.view.params.lat, "longitude": e.view.params.lat}}); 
        viewModel.set("parkingPoint", JSON.parse(e.view.params.ppoint));
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.parking = {
        init:init          
    };
}(app));