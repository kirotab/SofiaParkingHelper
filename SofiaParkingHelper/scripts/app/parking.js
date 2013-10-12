var app = app || {};

(function(a) {
   
    
    function removeParkingPoint(){
        if (hasParked()){
                showConfirm();
		}
    }
    
    function onConfirm(buttonIndex) {
        //alert('You selected button ' + buttonIndex);
        if (buttonIndex == 1){
            var newPoint = {"coords":{"latitude":0,"longitude":0}};
                viewModel.set("parkingPoint", newPoint);
			    localStorage.setItem("savedParkingPoint", JSON.stringify(newPoint));
                //location.reload(false);
                viewModel.set("hasParkedValue", hasParked());
                viewModel.set("hasParkedValueReverse", !hasParked());
        }
        else {
            
        }
    }

    // Show a custom confirmation dialog
    //
    function showConfirm() {
        navigator.notification.confirm(
            'Are you sure ?',    // message
             onConfirm,          // callback to invoke with index of button pressed
            'Unpark',            // title
            'Yes,No'             // buttonLabels
        );
    }
    
    
     function hasParked(){
        if (!viewModel.parkingPoint ||
            (viewModel.parkingPoint.coords.latitude == 0 && viewModel.parkingPoint.coords.longitude == 0)){
           return false;
        }
        else {
            return true;
        }
    }
    
    function setAddress(lat, long){
         httpRequest.getAddress(lat, long).then(function(address){
                viewModel.set("parkingAddress",address)
            });
    }
    
    function setParkingPoint() {
        cordovaExt.getLocation().
        then(function(location) {
            //var locationString = location.coords.latitude + "," + location.coords.longitude;
            
            setAddress(location.coords.latitude, location.coords.longitude);
            viewModel.set("parkingPoint", location);
            localStorage.setItem("savedParkingPoint", JSON.stringify(location));
            viewModel.set("hasParkedValue", hasParked());
            viewModel.set("hasParkedValueReverse", !hasParked());
            //return location;   
        });
        /*.then(function(point) {
            //viewModel.set("parkingPoint", {"lat": point.coords.latitude, "long": point.coords.longitude}); 
            viewModel.set("parkingPoint", point); 
            //console.log(point);
        });*/
    }
    
    function getParkingPoint() {
        //console.log(viewModel.parkingPoint);
        return viewModel.parkingPoint;
    }
    
    var viewModel = kendo.observable({
        //parkingPoint:{"lat":0,"long":0},
        parkingImageSrc: "#",
        parkingPoint:{"coords":{"latitude":0,"longitude":0}},
        parkingAddress:"Uncknown Address",
        setParkingPoint: setParkingPoint,
        getParkingPoint: getParkingPoint,
        test:"views/parking-view.html#parking-view",
        removeParkingPoint: removeParkingPoint,
        hasParked: hasParked,
        hasParkedValue: true,
        hasParkedValueReverse: true
    });
    
    function init(e) {
        //setParkingPoint();
        //console.log(e.view);
        //viewModel.set("parkingPoint", {"coords":{"latitude": e.view.params.lat, "longitude": e.view.params.lat}});
        var parkingPointParameter = e.view.params.ppoint;
        if (parkingPointParameter){
            viewModel.set("parkingPoint", JSON.parse(parkingPointParameter));
            localStorage.setItem("savedParkingPoint", parkingPointParameter);
            console.log("aaa");
        }
        else {            
            
            if (localStorage.getItem("savedParkingPoint") != undefined) {
			    var storedPoint = localStorage.getItem("savedParkingPoint");
                viewModel.set("parkingPoint", JSON.parse(storedPoint));
                console.log("bbb");
            }
            else {
                viewModel.set("parkingPoint", {"coords":{"latitude":0,"longitude":0}});
                console.log("ccc");
            }
            if(!hasParked()){
                console.log("ddd");
            
                setParkingPoint();
                //viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(getParkingPoint));
            }
        }
        viewModel.set("hasParkedValue", hasParked());
        viewModel.set("hasParkedValueReverse", !hasParked());
        setAddress(viewModel.parkingPoint.coords.latitude, viewModel.parkingPoint.coords.longitude);
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.parking = {
        init:init          
    };
}(app));