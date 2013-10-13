var app = app || {};
var blueZonePolygon = blueZonePolygon || new google.maps.Polygon({ paths: blueZoneArray });
var greenZonePolygon = greenZonePolygon || new google.maps.Polygon({ paths: greenZoneArray });
var defaultZoomLevel = 13;
var watchID;

var defaultArrowUrl = "url('styles/img/direction-arrow.png')";
(function(a) {
    
    
    //console.log(blueZoneArray);
//rightShoulderFront.setMap(map);
    function handleZoomIn(){
       console.log("entered hande zoom in");
        
        var zoomLvl = viewModel.currentZoomLevel;
        if(zoomLvl < 16){
            viewModel.set("currentZoomLevel",zoomLvl+1);
        }
       console.log(viewModel.currentZoomLevel);
        return;
    }
    function handleZoomOut(){
       console.log("entered hande zoom in");
        
        var zoomLvl = viewModel.currentZoomLevel;
        if(zoomLvl > 1){
            viewModel.set("currentZoomLevel",zoomLvl-1);
        }
        console.log(viewModel.currentZoomLevel);
        return;
    }
   
    
    function handleCenterCurrentPoint(ev){
        viewModel.isCentered = true;
        return;
    }
    function handleCenterParkingPoint(ev){
        viewModel.isCentered = false;
        return;
    }
     
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
    function stopWatchingGeolocation() {
        console.log("in stop watch"+watchID);
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
    
    function startWatchingGeolocation() {
        console.log("before start" + watchID);
        if(!watchID){
            console.log("in watch stop");
            watchID = navigator.geolocation.watchPosition(
            geoWatchSuccess, geoWatchError, {enableHighAccuracy: true,maximumAge: 500}
            );
        }
        console.log("after start" + watchID);
    }
    
    function geoWatchSuccess(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        var latPark = viewModel.parkingPoint.coords.latitude
        var longPark = viewModel.parkingPoint.coords.longitude;
        var heading = position.coords.heading;
        
        viewModel.set("currentPoint", position);
        setZone("currentZone",viewModel.currentPoint);
        
       
       var zoomParam = "";
        if(viewModel.isCentered || !viewModel.hasParkedValue){
            zoomParam = "&zoom="+viewModel.currentZoomLevel;
        }

        var mapsBaseUrl = "http://maps.googleapis.com/maps/api/staticmap";
        var centerPar = "";
        if((lat != 0 && long != 0) && (viewModel.isCentered || !viewModel.hasParkedValue)){
            centerPar = "center=" + lat + "," + long +"&";
        }
        var sizePar = "size=300x300";
        var markersPar =""; 
        if (lat != 0 && long != 0){
            var curColor = getColorFromZone(viewModel.currentZone);
            
            
            //markersPar+= "&markers=icon:"+defaultArrowUrl+"|"+ lat + "," + long;
            markersPar+= "&markers=color%3a" + curColor + "|label%3aC|"+ lat + "," + long;
        }
        if (latPark != 0 && longPark != 0){
            var parkColor = getColorFromZone(viewModel.parkingZone);
            
            markersPar+= "&markers=color%3a" + parkColor + "|label%3aP|"+ latPark + "," + longPark;
        }
        //var pathPar = "&path=color%3a0x0000ff|weight%3a5|"+lat+","+long+"|"+latPark+","+longPark;
        var pathPar = "";
        if ((lat != 0 && long != 0) && (latPark != 0 && longPark != 0)){
            pathPar = "&path=color%3a0xff002299|weight%3a4|"+lat+","+long+"|"+latPark+","+longPark;
        }
        
        /*var pathParAreaGreenEncoded = google.maps.geometry.encoding.encodePath(greenZoneArray);
        console.log(pathParAreaGreenEncoded);*/
        
        var pathParAreaBlueEncoded = "";
        if(viewModel.showBlueZone){
            pathParAreaBlueEncoded =
            "&path=fillcolor:0x0000AA40%7Ccolor:0x0000FF66%7Cenc:" +
            "asrcGazhmCbFud@|@{Kg@{BuEg_AvIkB|Gf@jNfCbDlAbY`_@pAxAvIxk@ApCu@~MoSvXw]oF_MUcECsE_A";
        }
        var pathParAreaGreenEncoded = "";
        if(viewModel.showGreenZone){
            pathParAreaGreenEncoded =
            "&path=fillcolor:0x00AA0040%7Ccolor:0xFFFFFF00%7Cenc:"+
            "imucGoyhmCdG}We@mAbJk\\fKbAk@yIbGmA_CyWlBgHfKyC\\kBzAmAfPg`@dMua@rBwPhRf@QuDyCk^j@WxCr^HvD~MjBlInOpFta@n@?hDoYhCoKlRwa@pQm]tKeKJ\\_M|LcNpY_Ude@eFjXiA~MpRn\\tFlJ|@nD~ToD?`@eTbDlQdy@lB|Hv@bJw@bHgD`FnVnXzAz@xW|HKz@gYwIqLiMTpV`Iv_@p@jF}E~@yLmy@yGcMmLxNqWb^uKuTgCMoLnFaUwDk[aGoNkDqi@oQiDkClyAYrE~@bEB~LTv]nFnSwXt@_N@qCwIyk@qAyAcYa_@cDmAkNgC}Gg@wIjBtEf_Af@zB}@zKcFtd@^PmyAX";
        }
        
        //var arrow = document.getElementById("arrow");
        var map = document.getElementById("map-canvas");
        
        //map.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + pathPar + pathParAreaBlue + markersPar +"&sensor=false&zoom=14";
        
        map.src = mapsBaseUrl + "?" + centerPar + sizePar + pathPar +markersPar+pathParAreaGreenEncoded+ pathParAreaBlueEncoded +"&sensor=false" + zoomParam;
        
        //map.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
       
        arrow.style.webkitTransform = "rotate(" + (heading | 0) + "deg)";
        
        
        
        
        /*if(!viewModel.parkingPoint || (viewModel.parkingPoint.coords.latitude == 0 && viewModel.parkingPoint.coords.longitude == 0)){
                viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(position));
        }*/
        
        httpRequest.getAddress(position.coords.latitude, position.coords.longitude).then(function(a){
                //console.log(a);
                viewModel.set("currentAddress",a)
            });
        
        
        
        //console.log(viewModel.parkingAddress);
    }

    function geoWatchError(error) {
        alert("error " + error)
    }
    
    function handleOptionsButton(e){
        //console.log(e);
        //console.log("handle button options func");
        if(viewModel.selectedOption == 10){
            exitApp();
        }
        //BlueZone
        else if(viewModel.selectedOption == 0){
            toggleBlueZone();
        }
        //GreenZone
        else if(viewModel.selectedOption == 1){
            toggleGreenZone();
        }
        //Stop Geolocation Watch
        else if (viewModel.selectedOption == 9){
            stopWatchingGeolocation();
        }
        //Start Geolocation Watch
        else if (viewModel.selectedOption == 8){
            startWatchingGeolocation();
        }
    }
    function toggleBlueZone(){
        //console.log("blue zone func");
        //cordovaExt.isWithinPoly(viewModel.currentPoint,blueZonePolygon);
        var show = viewModel.showBlueZone;
        viewModel.set("showBlueZone",!show);
    }
    function toggleGreenZone(){
        //console.log("green zone func");
        //cordovaExt.isWithinPoly(viewModel.currentPoint,greenZonePolygon);
        var show = viewModel.showGreenZone;
        viewModel.set("showGreenZone",!show);
    }
    function exitApp(){
        //console.log("in exit app func");
        showConfirmExit();
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
                viewModel.set("test","views/parking-view.html#parking-view");
                httpRequest.getAddress(viewModel.parkingPoint.coords.latitude, viewModel.parkingPoint.coords.longitude).then(function(a){
                    //console.log(a);
                    viewModel.set("parkingAddress",a)
                    setZone("parkingZone",viewModel.parkingPoint);
                });
        }
        else {
            
        }
    }
    
    function onConfirmExit(buttonIndex) {
        if (buttonIndex == 10){
            console.log("in exit app func confirm");
            if (navigator.app) {
                navigator.app.exitApp();
            }
            else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
    }

    function showConfirmExit() {
        navigator.notification.confirm(
            'Are you sure ?',    // message
             onConfirmExit,          // callback to invoke with index of button pressed
            'Exit',            // title
            ['Yes','No']             // buttonLabels
        );
    }
    
    function showConfirm() {
        navigator.notification.confirm(
            'Are you sure ?',    // message
             onConfirm,          // callback to invoke with index of button pressed
            'Unpark',            // title
            ['Yes','No']             // buttonLabels
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
    
    
    function onOptionChanged(e) {
        //console.log(e.sender._selectedValue);
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
        options:[
        {"Name":"Blue Zone","Value":"0"},
        {"Name":"Green Zone","Value":"1"},
        {"Name":"Start Watch","Value":"8"},
        {"Name":"Stop Watch","Value":"9"},
        {"Name":"Exit","Value":"10"}],
        selectedOption:"",
        change:onOptionChanged,
        handleOptionsButton: handleOptionsButton,
        isMainPage: true,
        parkingZone: "",
        currentZone: "",
        isCentered: true,
        handleCenterCurrentPoint: handleCenterCurrentPoint,
        handleCenterParkingPoint: handleCenterParkingPoint,
        currentZoomLevel: defaultZoomLevel,
        handleZoomIn:handleZoomIn,
        handleZoomOut:handleZoomOut,
        showGreenZone:true,
        showBlueZone:true
        
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
        httpRequest.getAddress(viewModel.parkingPoint.coords.latitude, viewModel.parkingPoint.coords.longitude).then(function(a){
            //console.log(a);
            viewModel.set("parkingAddress",a)
        });
        
        setZone("parkingZone",viewModel.parkingPoint);

        //viewModel.set("options",);
        startWatchingGeolocation();
        
        kendo.bind(e.view.element, viewModel);
    }   
    
    a.current = {
        init:init          
    };
    
}(app));


