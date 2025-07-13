import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import NavigateToPickup from './NavigateToPickup';

function DriverDashBoardMap({ rideInfo, phase }) {


  const driverLat = rideInfo?.driver_loc?.lati || 11.0;
  const driverLng = rideInfo?.driver_loc?.lngi || 75.0;

  return (
    <>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <APIProvider apiKey={'AIzaSyAtDN_jFGEmle4__UZbUSLubKU1R3HHoc0'}>
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultZoom={13}
          defaultCenter={{ lat: driverLat, lng: driverLng }}
        >
          {phase === 'ToPickup' && <NavigateToPickup rideInfo={rideInfo} />}
        </Map>
      </APIProvider>
    </div>
    </>
  );
}

export default DriverDashBoardMap;
