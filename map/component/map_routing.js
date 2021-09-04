const MapRouting =
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
        var mymap = L.map('mapid').setView([11.19659, -2.37305], 5);
        L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
        {
            attribution: 'Map data &copy; OpenStreetMap contributors'
        }).addTo(mymap);

            var greenIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });



            var router = L.Routing.control({
            waypoints: [
                L.latLng(11.19659, -4.30286),
                L.latLng(12.35, -1.516667)
            ],
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
            createMarker: function (i, wp, nWps) {
                return L.marker(wp.latLng, { icon: greenIcon }).bindPopup('Driver').openPopup();
            },
        })
            .on('routesfound', function (e) {
                var routes = e.routes;
            //alert('Found ' + routes.length + ' route(s).');
        }).addTo(mymap);

                /*var wpts = router.getWaypoints().map(({ latLng }) => {
                    return Object.values(latLng)
                })
            //console.log(wpts[0][0], ++wpts[0][0])
            //wpts[0][0]++
            /*
            mymap.on('click', addMarker)
            function addMarker(e) {
            var newMarker = new L.marker(e.latlng, {draggable: true })
            .bindPopup('Departure')
            .addTo(mymap);
            newMarker.openPopup()
            }
            */
            /*realtime = L.realtime({
            url: 'https://wanderdrone.appspot.com/',
            crossOrigin: true,
            type: 'json'
            }, {
            interval: 3 * 1000
            }).addTo(mymap);

            realtime.on('update', function () {
            mymap.fitBounds(realtime.getBounds(), { maxZoom: 3 });
            });*/
            var x = [[11.20, -4.31], [11.21, -4.32], [11.22, -4.33], [11.23, -4.34], [11.24, -4.37], [11.26, -4.36], [11.27, -4.38], [11.29, -4.44], [12.27, -3.38], [12.29, -3.44]]
            x = x.concat(',', x.reverse())

            var i = 0
            setInterval(() => {
                if (i < x.length) {
                    router.spliceWaypoints(0, 1, L.latLng(x[i]))
                    i++
                }
            }, 6000);

</script>



</body>

</html>
`

export default MapRouting