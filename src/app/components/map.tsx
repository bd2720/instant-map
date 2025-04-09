"use client";

import ReactMapGL from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function Map(){
  return (
      <ReactMapGL
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/light-v11"
        initialViewState={{
          longitude: -74,
          latitude: 40.68,
          zoom: 10,
        }}
      />
  );
}