var app = app || {};

(function(a) {
   
    function handleOptionsButton(e){
        console.log(e);
        console.log("handle button options func");
        if(viewModel.selectedOption == 1){
            exitApp();
        }
        else if(viewModel.selectedOption == 0){
            toggleBlueZone();
        }
    }
    function toggleBlueZone(){
        console.log("blue zone func");
    }
    
    function exitApp(){
        console.log("exit app func");
        
        navigator.app.exitApp();
    }
    
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
    
    function onPrompt(results) {
        alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
    }

    // Show a custom prompt dialog
    //
    function showPrompt() {
        navigator.notification.prompt(
            'Please enter your name',  // message
            onPrompt,                  // callback to invoke
            'Registration',            // title
            ['Ok','Exit'],             // buttonLabels
            'Jane Doe'                 // defaultText
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
        var map = document.getElementById("map-canvas");
        map.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + "&" + "&sensor=true&zoom=15";
        
        map.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
       
        
   
        //arrow.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
        viewModel.set("currentPoint", position);
        if(!viewModel.parkingPoint || (viewModel.parkingPoint.coords.latitude == 0 && viewModel.parkingPoint.coords.longitude == 0)){
                viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(position));
        }
        httpRequest.getAddress(position.coords.latitude, position.coords.longitude).then(function(a){
                //console.log(a);
                viewModel.set("currentAddress",a)
            });
        httpRequest.getAddress(viewModel.parkingPoint.coords.latitude, viewModel.parkingPoint.coords.longitude).then(function(a){
                //console.log(a);
                viewModel.set("parkingAddress",a)
            });
        //console.log(viewModel.parkingAddress);
    }

    function geoWatchError(error) {
        alert("error " + error)
    }
    
    function onOptionChanged(e) {
        console.log(e.sender._selectedValue + "asd");
          
        viewModel.set("selectedOption", e.sender._selectedValue);
    }
        
    //VIEW MODEL // //VIEW MODEL // //VIEW MODEL // //VIEW MODEL // //VIEW MODEL //
    var viewModel = kendo.observable({
        currentPoint:{"coords":{"latitude":0,"longitude":0}},
        parkingPoint:{"coords":{"latitude":0,"longitude":0}},
        parkingAddress:httpRequest.getAddress(0,0),
        test:"views/parking-view.html#parking-view",
        startWatchingGeolocation: startWatchingGeolocation,
        removeParkingPoint: removeParkingPoint,
        hasParked: hasParked,
        hasParkedValue: true,
        hasParkedValueReverse: true,
        options:[{"Name":"Blue Zone","Value":"0"},{"Name":"Exit","Value":"1"}],
        selectedOption:"",
        change:onOptionChanged,
        handleOptionsButton: handleOptionsButton
    });
    //VIEW MODEL // //VIEW MODEL // //VIEW MODEL // //VIEW MODEL // //VIEW MODEL //
    function init(e) {
        if (localStorage.getItem("savedParkingPoint") != undefined) {
			    var storedPoint = localStorage.getItem("savedParkingPoint");
                viewModel.set("parkingPoint", JSON.parse(storedPoint));
                viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ storedPoint);
            }
            else {
                viewModel.set("parkingPoint", {"coords":{"latitude":0,"longitude":0}});
            }
            viewModel.set("hasParkedValue", hasParked());
            viewModel.set("hasParkedValueReverse", !hasParked());

        //viewModel.set("options",);
        startWatchingGeolocation();
        
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.current = {
        init:init          
    };
}(app));


 