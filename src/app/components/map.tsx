"use client";

import ReactMapGL, { type MapRef, type MapMouseEvent, Source, Layer, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Feature, FeatureCollection, Point } from 'geojson';
import { useRef, useState } from 'react';
import { usePinImage } from '../hooks/use-pin-image';

interface MapProps {
  data: FeatureCollection | null
}

export default function Map({ data }: MapProps){
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hoveredPointId, setHoveredPointId] = useState<string | number | undefined>();
  const [selectedPoint, setSelectedPoint] = useState<Feature<Point>>();
  
  // load pin image in custom hook
  const imageLoaded = usePinImage(mapRef, mapLoaded);

  // determine number of features (use point layer if too many)
  const numFeatures = data?.features.length ?? 0;
  const renderPins = numFeatures < 100;

  // called when the mouse is moving over the map
  function handleMouseMove(e: MapMouseEvent){
    if(!e.features) return;
    // update hovered point
    setHoveredPointId((e.features.length) ? e.features[0].id : undefined);
  }

  // called when the mouse clicks on the map
  function handleMouseDown(e: MapMouseEvent){
    if(!e.features?.length || e.features[0].geometry.type !== 'Point') return;
    // update selected point
    const clickedPoint = e.features[0] as Feature<Point>;
    setSelectedPoint((clickedPoint.id !== selectedPoint?.id) ? clickedPoint : undefined);
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
              (renderPins) ? (
                <Layer type="symbol" id="data-pin"
                  layout={{
                    "icon-allow-overlap": true,
                    "icon-image": "pin",
                    "icon-size": 0.69,
                    "icon-offset": [0, -25],
                    "symbol-sort-key": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], 2,
                      ["==", ["id"], selectedPoint?.id ?? null], 1,
                      0
                    ]
                  }}
                  paint={{
                    "icon-color": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], "#64748b",
                      ["==", ["id"], selectedPoint?.id ?? null], "#64748b",
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
                      ["==", ["id"], selectedPoint?.id ?? null], 1,
                      0
                    ]
                  }}
                  paint={{
                    "circle-radius": 5,
                    "circle-color": [
                      "case",
                      ["==", ["id"], hoveredPointId ?? null], "#64748b",
                      ["==", ["id"], selectedPoint?.id ?? null], "#64748b",
                      "#020617"
                    ]                    
                  }}
                />
              )
            }  
          </Source>
        )}
        {selectedPoint && (
          <Popup longitude={selectedPoint.geometry.coordinates[0]} latitude={selectedPoint.geometry.coordinates[1]} className="text-slate-950"
            onClose={() => setSelectedPoint(undefined)}
            closeOnClick={false}
            offset={(renderPins) ? 36 : 4}
          >
            <h2 className="text-xl font-bold text-slate-500 text-center">
              Properties
            </h2>
            <ul>
              {Object.entries(selectedPoint.properties ?? {}).map(([name, property]) => (
                <li key={name}>
                  <span className="text-slate-700 font-bold">
                    {name}:{' '}
                  </span>
                  <span className="text-slate-500">
                    {property}
                  </span>
                </li>
              ))}
            </ul>
          </Popup>
        )}
      </ReactMapGL>
  );
}