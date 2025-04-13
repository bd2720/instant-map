"use client";

import ReactMapGL, { Source, Layer, MapRef, MapMouseEvent } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FeatureCollection } from 'geojson';
import { useRef, useState } from 'react';
import { usePinImage } from '../hooks/use-pin-image';

interface MapProps {
  data: FeatureCollection | null
}

export default function Map({ data }: MapProps){
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredPointId, setHoveredPointId] = useState<string | number | undefined>();
  const [selectedPointId, setSelectedPointId] = useState<string | number | undefined>();

  // load pin image in custom hook
  const imageLoaded = usePinImage(mapRef, mapLoaded);

  // determine number of features (use point layer if too many)
  const numFeatures = data?.features.length ?? 0;

  // called when the mouse is moving over the map
  function handleMouseMove(e: MapMouseEvent){
    if(!e.features) return;
    // update hovered point
    setHoveredPointId((e.features.length) ? e.features[0].id : undefined);
  }

  // called when the mouse clicks on the map
  function handleMouseDown(e: MapMouseEvent){
    if(!e.features?.length) return;
    // update selected point
    setSelectedPointId((e.features[0].id !== selectedPointId) ? e.features[0].id : undefined);
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
        interactiveLayerIds={["data-pin", "data-point"]}
        cursor={(hoveredPointId !== undefined) ? 'pointer' : 'auto'}
        onLoad={() => setMapLoaded(true)}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        {data && imageLoaded && (
          <Source type="geojson" data={data} generateId>
            {
              (numFeatures < 100) ? (
                <Layer type="symbol" id="data-pin"
                  layout={{
                    "icon-allow-overlap": true,
                    "icon-image": "pin",
                    "icon-size": 0.69,
                    "icon-offset": [0, -25],
                    "symbol-sort-key": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], 2,
                      ["==", ["id"], selectedPointId ?? null], 1,
                      0
                    ]
                  }}
                  paint={{
                    "icon-color": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], "#64748b",
                      ["==", ["id"], selectedPointId ?? null], "#64748b",
                      "#020617"
                    ]
                  }}
                />
              ) : (
                <Layer type="circle" id="data-point"
                  layout={{
                    "circle-sort-key": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], 2,
                      ["==", ["id"], selectedPointId ?? null], 1,
                      0
                    ]
                  }}
                  paint={{
                    "circle-radius": 5,
                    "circle-color": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], "#64748b",
                      ["==", ["id"], selectedPointId ?? null], "#64748b",
                      "#020617"
                    ]                    
                  }}
                />
              )
            }  
          </Source>
        )}
      </ReactMapGL>
  );
}