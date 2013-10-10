var app = app || {};

(function(a) {
   
    
    function setParkingP() {
        cordovaExt.getLocation().
        then(function(location) {
            //var locationString = location.coords.latitude + "," + location.coords.longitude;            
            return location;   
        })
        .then(function(point) {
            viewModel.set("parking", point); 
            console.log(point);
        });
    }
    
    function getParkingP() {
        return viewModel.parkingPoint;
    }
    
    var viewModel = kendo.observable({
        parking:{},
        setParkingPoint: setParkingP,
        getParkingPoint: getParkingP
    });
    
    function init(e) {
        kendo.bind(e.view.element, viewModel);
        setParkingPoint();
    }   
    
    a.parking = {
        init:init          
    };
}(app));