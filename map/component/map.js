const Map =
	`<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1.0">

    <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />

    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.2.0/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet@1.2.0/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>
    <script src="http://www.liedman.net/leaflet-realtime/dist/leaflet-realtime.js"></script>
</head>

<body style="padding: 0; margin: 0">
    <div id="mapid" style="width: 100%; height: 100vh;"></div>
    <script>
    var AllMarkers = []

    
    var mymap = L.map('mapid').setView([11.19659, -2.37305], 5);
    L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    {
        attribution: 'Map data &copy; OpenStreetMap contributors'
    }).addTo(mymap);

    /*var layers = mymap.getLayers();
       alert(JSON.stringify(layers))
       layers.forEach((x)=>
       {
           mymap.removeLayer(x)
       })*/



    //adds the routing machine to the map
    var router = L.Routing.control({
    waypoints: [],
    addWaypoints: false,
    draggableWaypoints: true,
    routeWhileDragging: true,
    //geocoder: L.Control.Geocoder.nominatim(),
    lineOptions:
    {
        styles: [{
            color: '#DB4437',
            opacity: 1,
            weight: 3
        }]
    },
    showAlternatives: true,
    altLineOptions:
    {
        styles: [{
            color: '#ffce44',
            opacity: 0.7,
            weight: 2
        }]
    },
    router: new L.Routing.osrmv1({
        language: 'en',
    }),
}).addTo(mymap);

//function to add new marker
    function addMarker(e) {
    //alert(123)
    if(AllMarkers.length<2)
    {
        var newMarker = new L.marker(e.latlng, { draggable: true })
            .addTo(mymap)

        //if there is only 0 marker
        if(AllMarkers.length==0)
        {
            newMarker.bindPopup('Departure')
        }
        //if there is 1 marker
        else if(AllMarkers.length==1)
        {
            newMarker.bindPopup('Arrival')
        }
        AllMarkers.push(e.latlng)
        if(AllMarkers.length==2)
        {
            window.ReactNativeWebView.postMessage(JSON.stringify(AllMarkers))
        }
        newMarker.openPopup()
    }
    newMarker.on("dragend", (e)=>
    {
            if(newMarker.getPopup().getContent()=="Departure")
            {
                AllMarkers[0] = newMarker.getLatLng()
            }
            else
            {
                AllMarkers[1] = newMarker.getLatLng()
            }
        window.ReactNativeWebView.postMessage(JSON.stringify(AllMarkers))
    })
}

</script>



</body>

</html>
`

export default Map