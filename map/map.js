const html = `<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1.0">

    <link rel="shortcut icon" type="image/x-icon" href="docs/images/favicon.ico" />


    <link rel="stylesheet" href="https://unpkg.com/leaflet@latest/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.css" />
    <script src="https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js"></script>

    <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />


</head>
<style>

/* styles for the map container*/
    #mapid
    {
        width: 100%;
        height: 94vh;
    }
/* messages*/
    #messages
    {
        height: 5vh;
        font-family: "Helvetica";
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #198754;
        color: white;
        border-radius: 0px 0px 3px 3px;
    }
/*messages when it is a link for reloading*/
    #messages a
    {
        color: white;
        font-family: helvetica;
        text-decoration: none;
    }
/************* Leaflet *************/
    .leaflet-popup-content
    {
        margin: 8px 8px;
        line-height: 1.4;
        text-align: center;
    }
/*popup details*/
    .details
    {
        max-width: 140px;
        display: flex;
        flex-direction: column;
    }
/*popup details about the corner*/
    .placeInfo
    {
        font-family: helvetica;
        display: flex;
        justify-content: center;
        text-align: justify;
        font-size: 12px
    }
/*popup details show pathway btn*/
    .Showpathway
    {
        border: 1px solid;
        border-radius: .25rem;
        background-color: #007bff;
        border-color: #007bff;
        color: white;
        align-self: center;
    }

/*user position setter*/
    .positionButton
    {
        border: 2px solid rgba(0,0,0,0.2);
        height: 40px;
        width: 40px;
        border-radius: 50%;
        position: absolute;
        left: 10px;
        top: 280px;
        z-index: 1000;
        display: flex;
        align-content: center;
        justify-content: center;
        background-color: white;
        box-shadow: 0 1px 5px rgba(0,0,0,0.4);
    }
/*position icon*/
    .PositionIcon
    {
        height: 40px;
        width: 40px;
    }
/*for common smartphones*/
    @media only screen and (max-width: 640px)
    {
        /*the routing container*/
        .leaflet-routing-container
        {
            position: relative;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            opacity: 0.8;
            backdrop-filter: blur(2px);
            transition: all 1s ease-in-out;
            font-family: "Helvetica";
            border: 3px solid black;
        }
        /*differents pathways found description*/
        .leaflet-routing-alt
        {
            height: 180px;
        }

        .leaflet-top .leaflet-control
        {
            margin-bottom: 10px;
        }

        /* increases the default font-size**/
        .leaflet-routing-container table tr
        {
            font-size: 14px;
        }
        .leaflet-routing-container h2
        {
            font-size: 16px;
        }

        .leaflet-routing-container h3
        {
            font-size: 14px;
            font-weight: normal;
        }
        /*user current btn placed at the right*/
        .positionButton
        {
            position: absolute;
            left: 85%;
        }
    }

</style>

<body style="padding: -7;">
    <div id="mapid"></div>
    <div class="positionButton"><a href="#" role="button" onclick="FlyTo()"><image src="https://i.ibb.co/DKPqTnR/location-update-64px.png" class="PositionIcon"></a></div>
    <div id="messages"></div>
    <script>
        //definition of interval variable for the message
        var interval = 0;
        //definition of the variale containing all markers to show on the map
        var addressPoints;
        //var for clustering markers
        var markers = L.markerClusterGroup();
        /*defines the map and its attributes*/
        var map = L.map('mapid').setView([11.19659, -2.37305], 5);
        L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        {
            attributionControl: false,
            attribution: 'Map data & copy; OpenStreetMap contributors',
            maxZoom: 18,
            //minZoom: 4
        }).addTo(map);
        /*puts the map attribution at the bottom left*/
        map.attributionControl.setPosition('bottomleft');
        /*defintion of the router from leaflet-routng-machine*/
        var router = L.Routing.control({waypoints: [],
            addWaypoints: false,
            draggableWaypoints: false,
            routeWhileDragging: true,
            createMarker: ()=>{},
            lineOptions:
            {
                styles: [{
                    color: '#007bff',
                    opacity: 1,
                    weight: 3
                }]
            },
            showAlternatives: true,
            altLineOptions:
            {
                styles: [{
                    color: '#DB4437',
                    opacity: 0.7,
                    weight: 2
                }]
            },
            router: new L.Routing.osrmv1({
                language: 'fr',
            })
        }).addTo(map)

        /*adds a new marker when the map is clicked*/
        map.on('click', (e)=>addMarker(e.latlng, "Camp 1171", false, circle = {raduis: 100, color: '#FF7F00',
            fill: true, fillColor: '#FFFF00', fillOpacity: 0.9,}, isUserPos=false))

        addMarker([12.35, -1.516667], 'Moi')


        //function to create a new marker
        function addMarker(coords, text, draggable = true, circle = {}, isUserPos = true)
        {
            var newMarker = new L.marker(coords, {draggable: draggable, inertia: true })
            .bindPopup(isUserPos ? text : placeInfo(text, coords))
            newMarker.addTo(map)
            if(circle != {})
            {
                var circle = new L.circle(coords, circle.raduis,
                {fill: true, fillColor: circle.fillColor, color:circle.color, fillOpacity: 0.2})
            }
            newMarker.openPopup()
            markers.addLayer(newMarker);
            map.addLayer(markers)
        }
        /*function to add information related to the place*/
        function placeInfo(text, coords)
        {
            return '<div class="details"><b class="placeInfo">'+text+'ceci est du gros nimporte quoi</b><button onclick="pathTo('+JSON.stringify([coords.lat, coords.lng])+')" class="Showpathway">Itineraire</button>'
        }
        /*function to find the shortest paths*/
        function pathTo(destination)
        {
            /*splits coords to get the point A (departure) and B(Arrival)*/
            /*transforms the coords into leaflet-routing machine coords*/
            var A = new L.latLng(12.35, -1.516667), B = new L.latLng(destination[0], destination[1])
            /*sets the waypoints to the router*/
            router.setWaypoints([A, B])
            /*when the routing starts*/
            router.on('routingstart', function(e)
            {
                var dots = ''
                interval = setInterval(() =>
                {
                    //shows a message
                    setMessage('Recherche du meilleur itineraire' + dots)
                    dots.length < 3 ? dots += '.' : dots = ''
                }, 1000)

            })
            /*when routes has been found*/
            router.on('routesfound', function (e) {
                //removes the interval
                clearInterval(interval)
                var routes = e.routes;
                //shows a message
                setMessage(routes.length + (routes.length == 1 ? ' chemin a ete trouve' : ' chemins ont ete trouves' ));
                map.setView(A, 14, {
                    "animate": true,
                })
            })

            router.on('routingerror', function(e)
            {
                //removes the interval
                clearInterval(interval)
                //shows a message
                setMessage('<a href="">Une erreur est survenue. Veuillez reessayer</a>');
            })
            .addTo(map);

        }

        /*
        function selectParent(element)
        {
            element.parentElement.style.color = 'red'
        }
        */

        //function to remove a marker
        function removeMarker(marker)
        {
            console.log(marker)
            map.removeLayer(marker)
        }

        //function to display messages to the user
        function setMessage(message)
        {
            console.log(message)
            document.getElementById('messages').innerHTML = "<span>"+message+"</span>";
        }

        //function to fetch the user position
        function getCurrentPosition()
        {

        }
        //function to fly to an certain position
        function FlyTo()
        {
            var coords = [12.35, -1.516667]
            //applies the method to the map
            map.flyTo([coords[0], coords[1]], 10,
            {
                animate: true,
                duration: 2 // in seconds
            });
        }

        /*permutes the leaflet routing results from top to bottom if it is a smartphone*/
        var RoutingContainerPosition = document.getElementsByClassName("leaflet-top leaflet-right")[0]
        var WindowSize = window.matchMedia("(max-width: 640px)")
        if (WindowSize.matches)
        {
            RoutingContainerPosition.classList.add("leaflet-bottom");
            RoutingContainerPosition.classList.remove("leaflet-top");
        }

        //////////////////////////////
    //funtion to set markers on the map
    function SetMarkers(addressPoints)
    {
        for (var i = 0; i < addressPoints.length; i++)
        {
            //location parameters
            var a = addressPoints[i];
            //get marker title
            var title = a[2];
            //set marker

            var marker = addMarker(new L.LatLng(a[0], a[1]), title, draggable = false, circle = {})
            markers.addLayer(marker);
        }
    }
        //////////////////////////////

</script>
</body>

</html>

`
export default html