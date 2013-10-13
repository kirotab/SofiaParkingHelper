var app = app || {};
var defaultArrowUrl = "url('styles/img/direction-arrow.png')";
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
        var latPark = viewModel.parkingPoint.coords.latitude
        var longPark = viewModel.parkingPoint.coords.longitude;
        var heading = position.coords.heading;

        var mapsBaseUrl = "http://maps.googleapis.com/maps/api/staticmap";
        var centerPar = "center=" + lat + "," + long;
        var sizePar = "size=400x400";
        var markersPar =""; 
        /*if (lat != 0 && long != 0){
            //markersPar+= "&markers=icon:"+defaultArrowUrl+"|"+ lat + "," + long;
            markersPar+= "&markers=color%3apurple|label%3aC|"+ lat + "," + long;
        }*/
        if (latPark != 0 && longPark != 0){
            markersPar+= "&markers=color%3ablue|label%3aP|"+ latPark + "," + longPark;
        }
        //var pathPar = "&path=color%3a0x0000ff|weight%3a5|"+lat+","+long+"|"+latPark+","+longPark;
        if ((lat != 0 && long != 0) && (latPark != 0 && longPark != 0)){
            var pathPar = "&path=color%3a0x0000ff|weight%3a4|"+lat+","+long+"|"+latPark+","+longPark;
        }
        //if(lat != 0 && long != 0)
           // centerPar = "";
        
        
        //var pathParArea = "&path=color:0xFFFFFF00|weight:5|fillcolor:0xAA000033|" + "42.696804,23.320820|" + "42.697435,23.316786|" + "42.695826,23.321078";
        var pathParAreaBlue = "&path=color:0xFFFFFF00|weight:5|fillcolor:0x0000AA70" + blueZone;
        //var pathParAreaGreen = "&path=color:0xFFFFFF00|weight:5|fillcolor:0x00AA0070" + greenZone;
        
        /*var pathParAreaGreenEncoded = google.maps.geometry.encoding.encodePath(greenZoneArray);
        console.log(pathParAreaGreenEncoded);*/
        
        //"imucGoyhmCdG}We@mAbJk\fKbAk@yIbGmA_CyWlBgHfKyC\kBzAmAfPg`@dMua@rBwPhRf@QuDyCk^j@WxCr^HvD~MjBlInOpFta@n@?hDoYhCoKlRwa@pQm]tKeKJ\_M|LcNpY_Ude@eFjXiA~MpRn\tFlJ|@nD~ToD?`@eTbDlQdy@lB|Hv@bJw@bHgD`FnVnXzAz@xW|HKz@gYwIqLiMTpV`Iv_@p@jF}E~@yLmy@yGcMmLxNqWb^uKuTgCMoLnFaUwDk[aGoNkDqi@oQiDkClxAk@bFud@|@{Kg@{BuEg_AvIkB|Gf@jNfCbDlAbY`_@pAxAvIxk@ApCu@~MoSvXw]oF_MUcECsE_A_@QmxAj@"
        var pathParAreaGreenEncoded =
        "&path=fillcolor:0xAA000033%7Ccolor:0xFFFFFF00%7Cenc:"+
        "imucGoyhmCdG}We@mAbJk\fKbAk@yIbGmA_CyWlBgHfKyC\kBzAmAfPg`@dMua@rBwPhRf@QuDyCk^j@WxCr^HvD~MjBlInOpFta@n@?hDoYhCoKlRwa@pQm]tKeKJ\_M|LcNpY_Ude@eFjXiA~MpRn\tFlJ|@nD~ToD?`@eTbDlQdy@lB|Hv@bJw@bHgD`FnVnXzAz@xW|HKz@gYwIqLiMTpV`Iv_@p@jF}E~@yLmy@yGcMmLxNqWb^uKuTgCMoLnFaUwDk[aGoNkDqi@oQiDkClyAYrE~@bEB~LTv]nFnSwXt@_N@qCwIyk@qAyAcYa_@cDmAkNgC}Gg@wIjBtEf_Af@zB}@zKcFtd@^PmyAX";
        
        
        map.src = "http://maps.googleapis.com/maps/api/staticmap?size=400x400&path=fillcolor:0xAA000033%7Ccolor:0xFFFFFF00%7Cenc:imucGoyhmCdG}We@mAbJk\fKbAk@yIbGmA_CyWlBgHfKyC\kBzAmAfPg`@dMua@rBwPhRf@QuDyCk^j@WxCr^HvD~MjBlInOpFta@n@?hDoYhCoKlRwa@pQm]tKeKJ\_M|LcNpY_Ude@eFjXiA~MpRn\tFlJ|@nD~ToD?`@eTbDlQdy@lB|Hv@bJw@bHgD`FnVnXzAz@xW|HKz@gYwIqLiMTpV`Iv_@p@jF}E~@yLmy@yGcMmLxNqWb^uKuTgCMoLnFaUwDk[aGoNkDqi@oQiDkClyAYrE~@bEB~LTv]nFnSwXt@_N@qCwIyk@qAyAcYa_@cDmAkNgC}Gg@wIjBtEf_Af@zB}@zKcFtd@^PmyAX&sensor=false";
        
        //var arrow = document.getElementById("arrow");
        var map = document.getElementById("map-canvas");
        //map.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + pathPar+ pathParAreaGreenEncoded + markersPar +"&sensor=false&zoom=14";
        //map.src = mapsBaseUrl + "?" + sizePar + pathParAreaGreenEncoded +"&sensor=false";
        
        map.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
        //var markersPar = "markers=color%3ablue|label%3aP|" + lat + "," + long + "|" + viewModel.parkingPoint.coords.latitude + "," + viewModel.parkingPoint.coords.longitude;
       
   
        //arrow.style.webkitTransform = "rotate(" + (-heading | 0) + "deg)";
        viewModel.set("currentPoint", position);
        /*if(!viewModel.parkingPoint || (viewModel.parkingPoint.coords.latitude == 0 && viewModel.parkingPoint.coords.longitude == 0)){
                viewModel.set("test","views/parking-view.html#parking-view?ppoint="+ JSON.stringify(position));
        }*/
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
        console.log("in exit app func");
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
        }
        else {
            
        }
    }
    
    function onConfirmExit(buttonIndex) {
        if (buttonIndex == 1){
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
    
    
    function onOptionChanged(e) {
        console.log(e.sender._selectedValue);
          
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
        handleOptionsButton: handleOptionsButton,
        isMainPage: true
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
    
    var blueZone =
"|42.698886,23.315689"+
"|42.69775,23.321718"+
"|42.697435,23.323778"+
"|42.69764,23.3244"+
"|42.698712,23.334679"+
"|42.696993,23.335215"+
"|42.695558,23.335022"+
"|42.693098,23.334335"+
"|42.692278,23.333949"+
"|42.688098,23.328821"+
"|42.687688,23.32837"+
"|42.685969,23.321203"+
"|42.685984,23.320474"+
"|42.686253,23.31807"+
"|42.689533,23.313951"+
"|42.694454,23.315152"+
"|42.696693,23.315259"+
"|42.697671,23.315281"+
"|42.698728,23.315603";
    
}(app));


