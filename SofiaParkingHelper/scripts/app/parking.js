var app = app || {};
var defaultImgUrl = defaultImgUrl || 'styles/img/default-picture.png';

(function(a) {
    
    function setZone(zoneName, zoneProp){
        
        if (cordovaExt.isWithinPoly(zoneProp,blueZonePolygon)){
                viewModel.set(zoneName,"Blue");
            }
        else if (cordovaExt.isWithinPoly(zoneProp,greenZonePolygon)){
                viewModel.set(zoneName,"Green");
            }
        else {
            //console.log("Zone None");
            viewModel.set(zoneName,"None");
        }
    }
    function getColorFromZone(zoneName){
        if (zoneName == "Blue"){
            //console.log("color Blue");
            //console.log(zoneName);
            
            return "blue";
        }
        else if (zoneName == "Green"){
            //console.log("color Green");
            //console.log(zoneName);
            return "green";
        }
        else {
            //console.log("color Red");
            //console.log(zoneName);
            
            return "red";
        }
    }
    
    
    
    function takePicture() {
    navigator.camera.getPicture(function (imageBase64) {
                //console.log(imageBase64);
                //document.getElementById("parking-image").src = "data:image/jpeg;base64," + imageBase64;
                localStorage.setItem("savedParkingPic", imageBase64);
                viewModel.set("savedPicture", "data:image/jpeg;base64," + imageBase64);
        
            }, function (error) {
              alert('Failed because: ' + message);
            }, {
                
                quality: 50,
                destinationType: 0,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 200,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            });
        }
    
    function loadPicFromStorage(){
        if (localStorage.getItem("savedParkingPic") != undefined) {
		    var storedPic = localStorage.getItem("savedParkingPic");
            if(storedPic != "#"){
                viewModel.set("savedPicture", "data:image/jpeg;base64,"+ storedPic);
            }
            else{
                viewModel.set("savedPicture", defaultImgUrl);
            }
        }
    }
    
    function removeSavedPicture(){
        localStorage.setItem("savedParkingPic","#");
        viewModel.set("savedPicture", defaultImgUrl);    
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
                setAddress(newPoint.coords.latitude, newPoint.coords.longitude);
                removeSavedPicture();
                setZone("parkingZone",viewModel.parkingPoint);
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
            ['Yes','No']              // buttonLabels
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
            removeSavedPicture();
            setZone("parkingZone",viewModel.parkingPoint);
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
        hasParkedValueReverse: true,
        isMainPage: false,
        takePicture:takePicture,
        savedPicture:defaultImgUrl,
        removeSavedPicture:removeSavedPicture,
        parkingZone: ""
        
    });
    
    function init(e) {
        //setParkingPoint();
        //console.log(e.view);
        //viewModel.set("parkingPoint", {"coords":{"latitude": e.view.params.lat, "longitude": e.view.params.lat}});
        var parkingPointParameter = e.view.params.ppoint;
        if (parkingPointParameter ){
            viewModel.set("parkingPoint", JSON.parse(parkingPointParameter));
            localStorage.setItem("savedParkingPoint", parkingPointParameter);
            
            loadPicFromStorage();
            
            //console.log("aaa");
        }
        else {
            
            
            if (localStorage.getItem("savedParkingPoint") != undefined) {
			    var storedPoint = localStorage.getItem("savedParkingPoint");
                viewModel.set("parkingPoint", JSON.parse(storedPoint));
                //console.log("bbb");
                
                loadPicFromStorage();
            }
            else {
                viewModel.set("parkingPoint", {"coords":{"latitude":0,"longitude":0}});
                removeSavedPicture();
                //console.log("ccc");
            }
                
            //viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(getParkingPoint));
            
        }
        if(!hasParked()){
            //console.log("ddd");
            
            setParkingPoint();
        }
        viewModel.set("hasParkedValue", hasParked());
        viewModel.set("hasParkedValueReverse", !hasParked());
        setAddress(viewModel.parkingPoint.coords.latitude, viewModel.parkingPoint.coords.longitude);
        setZone("parkingZone",viewModel.parkingPoint);
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.parking = {
        init:init          
    };
}(app));