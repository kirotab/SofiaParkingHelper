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
        var pathParAreaBlue = 
        "&path=color:0xFFFFFF00|weight:5|fillcolor:0x0000AA70" + blueZone;
        var pathParAreaGreen = 
        "&path=color:0xFFFFFF00|weight:5|fillcolor:0x00AA0070" + greenZone;
        
        var pathParAreaGreenEncoded = google.maps.geometry.encoding.encodePath(greenZoneArray);
        
        
        
        
        //var arrow = document.getElementById("arrow");
        var map = document.getElementById("map-canvas");
        map.src = mapsBaseUrl + "?" + centerPar + "&" + sizePar + pathPar+ pathParAreaGreenEncoded + markersPar +"&sensor=false&zoom=14";
        
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
}(app));


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

var greenZone = 
"|42.713329,23.315603"+
"|42.71202,23.319594"+
"|42.71221,23.31998"+
"|42.710428,23.324679"+
"|42.708473,23.324336"+
"|42.708694,23.326074"+
"|42.707385,23.32646"+
"|42.708031,23.33043"+
"|42.707479,23.331911"+
"|42.705524,23.332683"+
"|42.705367,23.33322"+
"|42.704909,23.333606"+
"|42.70215,23.338927"+
"|42.699879,23.344485"+
"|42.699296,23.347317"+
"|42.696205,23.347124"+
"|42.696299,23.348025"+
"|42.697072,23.353046"+
"|42.696851,23.353175"+
"|42.696078,23.348111"+
"|42.696031,23.347188"+
"|42.693634,23.346652"+
"|42.691962,23.344013"+
"|42.690748,23.338455"+
"|42.690511,23.338455"+
"|42.689659,23.342704"+
"|42.688965,23.344699"+
"|42.685858,23.350257"+
"|42.682893,23.355128"+
"|42.680858,23.35708"+
"|42.680795,23.35693"+
"|42.683035,23.354699"+
"|42.685464,23.35045"+
"|42.688981,23.344335"+
"|42.690133,23.340279"+
"|42.690495,23.337876"+
"|42.687372,23.333155"+
"|42.686142,23.331331"+
"|42.685827,23.330451"+
"|42.682309,23.331331"+
"|42.682309,23.33116"+
"|42.685701,23.330344"+
"|42.682751,23.321032"+
"|42.682199,23.319444"+
"|42.681915,23.317663"+
"|42.682199,23.316204"+
"|42.683035,23.315066"+
"|42.679281,23.310989"+
"|42.678823,23.310689"+
"|42.674848,23.309101"+
"|42.674911,23.308801"+
"|42.679107,23.310517"+
"|42.681284,23.312813"+
"|42.681173,23.309037"+
"|42.679564,23.303801"+
"|42.679312,23.302621"+
"|42.680416,23.302299"+
"|42.682625,23.311655"+
"|42.684044,23.313908"+
"|42.68619,23.311376"+
"|42.690117,23.306397"+
"|42.692151,23.309874"+
"|42.69283,23.309938"+
"|42.69499,23.308736"+
"|42.698523,23.309659"+
"|42.703064,23.310946"+
"|42.70554,23.311805"+
"|42.712352,23.314766"+
"|42.713203,23.315474"+



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
"|42.698728,23.315603"+

"|42.698886,23.315689"+
"|42.713203,23.315474";


var greenZoneArray = [

(42.713329,23.315603),
(42.71202,23.319594),
(42.71221,23.31998),
(42.710428,23.324679),
(42.708473,23.324336),
(42.708694,23.326074),
(42.707385,23.32646),
(42.708031,23.33043),
(42.707479,23.331911),
(42.705524,23.332683),
(42.705367,23.33322),
(42.704909,23.333606),
(42.70215,23.338927),
(42.699879,23.344485),
(42.699296,23.347317),
(42.696205,23.347124),
(42.696299,23.348025),
(42.697072,23.353046),
(42.696851,23.353175),
(42.696078,23.348111),
(42.696031,23.347188),
(42.693634,23.346652),
(42.691962,23.344013),
(42.690748,23.338455),
(42.690511,23.338455),
(42.689659,23.342704),
(42.688965,23.344699),
(42.685858,23.350257),
(42.682893,23.355128),
(42.680858,23.35708),
(42.680795,23.35693),
(42.683035,23.354699),
(42.685464,23.35045),
(42.688981,23.344335),
(42.690133,23.340279),
(42.690495,23.337876),
(42.687372,23.333155),
(42.686142,23.331331),
(42.685827,23.330451),
(42.682309,23.331331),
(42.682309,23.33116),
(42.685701,23.330344),
(42.682751,23.321032),
(42.682199,23.319444),
(42.681915,23.317663),
(42.682199,23.316204),
(42.683035,23.315066),
(42.679281,23.310989),
(42.678823,23.310689),
(42.674848,23.309101),
(42.674911,23.308801),
(42.679107,23.310517),
(42.681284,23.312813),
(42.681173,23.309037),
(42.679564,23.303801),
(42.679312,23.302621),
(42.680416,23.302299),
(42.682625,23.311655),
(42.684044,23.313908),
(42.68619,23.311376),
(42.690117,23.306397),
(42.692151,23.309874),
(42.69283,23.309938),
(42.69499,23.308736),
(42.698523,23.309659),
(42.703064,23.310946),
(42.70554,23.311805),
(42.712352,23.314766),
(42.713203,23.315474),



(42.698886,23.315689),
(42.69775,23.321718),
(42.697435,23.323778),
(42.69764,23.3244),
(42.698712,23.334679),
(42.696993,23.335215),
(42.695558,23.335022),
(42.693098,23.334335),
(42.692278,23.333949),
(42.688098,23.328821),
(42.687688,23.32837),
(42.685969,23.321203),
(42.685984,23.320474),
(42.686253,23.31807),
(42.689533,23.313951),
(42.694454,23.315152),
(42.696693,23.315259),
(42.697671,23.315281),
(42.698728,23.315603),

(42.698886,23.315689),
(42.713203,23.315474)
]
 