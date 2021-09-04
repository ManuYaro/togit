import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { WebView } from 'react-native-webview';
import { MapRouting, MapRequesting, MapPlanning } from './maps'
import * as Location from 'expo-location';

/*_getLocation = async (getter)=>{ 
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted')
    {
        alert('Permissions not granted')
    }
    else
    {
        const userLocation = await Location.getCurrentPositionAsync(
            { enableHighAccuracy: true})
        const location = JSON.stringify(userLocation.coords)
        getter(location)
    }
}*/

//sync.on('change', (c)=>console.log(c))

const MapLeaf = ({type, getCoordinates}) => {
    const webview = useRef(null)

    _getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
            alert('Permissions not granted')
        }
        else {
            const userLocation = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High, timeInterval: 10000,
                    distanceInterval: 6
                },
                (loc) => {
                    setLocation(JSON.stringify(loc.coords))
                    setLoading(false)
                }
            );
        }
    }
    

       //alert(123)
        if (type == "routing") {
            _getLocation()
            if (!loading) {
                const { latitude, longitude } = JSON.parse(location)

                //insert location in the database
                webview.current.injectJavaScript(
                    `if (typeof marker !== 'undefined')
                    {
                        mymap.removeLayer(marker)
                    }
                    var marker = L.marker([${latitude}, ${longitude}]).addTo(mymap);
                    router.spliceWaypoints(0, 1, L.latLng([${latitude}, ${longitude}]))`)
            }
            //get the connected user current position
            /**if(userCurrentPosition)
             * {
             *      
             * }
             */
            return <WebView ref={webview} source={{ html: MapRouting }} cacheEnabled={true} onMessage={onMessage} />
        }
        //if the type is "planning"
        else if (type == "planing") {
            const referenceSetter = ()=>{
                webview.current.injectJavaScript(`mymap.on('click', addMarker)`)
            }
            

            return <WebView onLoad={referenceSetter} ref={webview} source={{ html: MapPlanning }} cacheEnabled={true} onMessage={onMessage} />
        }
        else if (type == "requesting") {
            _getLocation()
            if (loading == false) {
                const { latitude, longitude } = JSON.parse(location)
                //console.log(latitude, longitude);
                localDB.get("requesting").then((doc) => {
                    doc.date = Date.now().toString()
                    doc[Date().toString()] = [latitude, longitude]
                    //console.log(doc.coordinates);
                    //localDB.put(doc).catch((e)=>)
                })

                //insert location in the database
                webview.current.injectJavaScript(
                    `if (typeof marker !== 'undefined')
                    {
                        //mymap.removeLayer(marker)
                    }
                    if (typeof circle !== 'undefined')
                    {
                        mymap.removeLayer(circle)
                    }
                    var marker = L.marker([${latitude}, ${longitude}]).addTo(mymap);
                    var circle = L.circle([${latitude}, ${longitude}], 7500).addTo(mymap)`)
            }
            //when a user position changes
            //setDrivers()
            //selection of all drivers within 15000 meters
            /*if (L.latLng([latitude, longitude]).distance(L.latLng([lat2, long2])) >= 15000)
            {
                //insert the driver marker in the map
                webview.current.injectJavaScript(`
                var driver = L.marker([${ lat2 }, ${ long2 }]).addTo(mymap)
                `)
                
            }*/
            return <WebView ref={webview} source={{ html: MapRequesting }} cacheEnabled={true} onMessage={onMessage} />
        }
    
}

export default MapLeaf

