"use client";

import ReactMapGL, { Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';

interface MapProps {
  data: FeatureCollection | null
}

export default function Map({ data }: MapProps){
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
      >
        {data && (
          <Source type="geojson" data={data}>
            <Layer type="circle" 
              paint={{
                "circle-color": "#020617",
                "circle-radius": 5,
                "circle-stroke-color": "#f8fafc",
                "circle-stroke-width": 2,
              }}
            />
          </Source>
        )}
      </ReactMapGL>
  );
}