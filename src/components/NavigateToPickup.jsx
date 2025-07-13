import React, { useEffect, useState } from 'react';
import { Marker, useMap } from '@vis.gl/react-google-maps';
import 'bootstrap/dist/css/bootstrap.min.css';


function NavigateToPickup({ rideInfo }) {
  const map = useMap();
  const [polyline, setPolyline] = useState(null);
  const [liveDriverPos, setLiveDriverPos] = useState({
    lat: rideInfo.driver_loc.lati,
    lng: rideInfo.driver_loc.lngi,
  });


  // Track live driver GPS location
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLiveDriverPos(currentPos);

        map?.panTo(currentPos);
        map?.setZoom(15);
      },
      (error) => console.error('Error watching position:', error),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  // Draw route from driver to pickup
  useEffect(() => {
    if (
      map &&
      liveDriverPos &&
      rideInfo?.pickup?.lat &&
      rideInfo?.pickup?.longi &&
      window.google?.maps
    ) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: liveDriverPos,
          destination: {
            lat: rideInfo.pickup.lat,
            lng: rideInfo.pickup.longi,
          },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            const path = result.routes[0].overview_path;

            // Clear old polyline
            if (polyline) {
              polyline.setMap(null);
            }

            const newPolyline = new window.google.maps.Polyline({
              path,
              geodesic: true,
              strokeColor: '#007bff',
              strokeOpacity: 0.8,
              strokeWeight: 5,
            });

            newPolyline.setMap(map);
            setPolyline(newPolyline);

            map.fitBounds(result.routes[0].bounds);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    }
  }, [map, liveDriverPos, rideInfo]);

  return (
    <>
      {/* Driver Marker with car icon */}
      <Marker
        position={liveDriverPos}
        icon={{
          url: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />

      {/* Pickup Marker */}
      <Marker position={{ lat: rideInfo.pickup.lat, lng: rideInfo.pickup.longi }} />
    </>
  );
}

export default NavigateToPickup;
