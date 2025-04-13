"use client";

import ReactMapGL, { Source, Layer, MapRef, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { useRef, useEffect, useState } from 'react';

interface MapProps {
  data: FeatureCollection | null
}

export default function Map({ data }: MapProps){
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredPinId, setHoveredPinId] = useState<string | number | undefined>();

  // load map pin image
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if(!mapLoaded || !map) return;

    // check if we already have image
    if(map.hasImage('pin')){
      setImageLoaded(true);
      return;
    }

    // attempt to load image
    map.loadImage('/pin.png', (error, image) => {
      if(error || !image){
        console.error('Failed to load pin.png', error);
        return;
      }
      if (!map.hasImage('pin')){
        map.addImage('pin', image, { sdf: true });
        setImageLoaded(true);

      }
    });
  }, [mapLoaded]);

  // called when the mouse is moving over the map
  function handleMouseMove(e: MapMouseEvent){
    if(!e.features) return;
    // update hovered pin
    setHoveredPinId((e.features.length) ? e.features[0].id : undefined);
  }

  return (
      <ReactMapGL
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        ref={mapRef}
        style={{width: "100%", height: "100%"}}
        mapStyle="mapbox://styles/mapbox/light-v11"
        initialViewState={{
          longitude: -74,
          latitude: 40.68,
          zoom: 10,
        }}
        interactiveLayerIds={["data-pin"]}
        cursor={(hoveredPinId !== undefined) ? 'pointer' : 'auto'}
        onLoad={() => setMapLoaded(true)}
        onMouseMove={handleMouseMove}
      >
        {data && imageLoaded && (
          <Source type="geojson" data={data} generateId>
            <Layer type="symbol" id="data-pin"
              layout={{
                "icon-allow-overlap": true,
                "icon-image": "pin",
                "icon-size": 0.69,
                "icon-offset": [0, -25],
                "symbol-sort-key": [
                  "match",
                  ["id"], 
                  hoveredPinId ?? '', 1,
                  0
                ]
              }}
              paint={{
                "icon-color": [
                  "match",
                  ["id"],
                  hoveredPinId ?? '', "#64748b",
                  "#020617"
                ]
              }}
            />
          </Source>
        )}
      </ReactMapGL>
  );
}