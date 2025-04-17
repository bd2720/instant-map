import { type MapRef } from "react-map-gl/mapbox";
import { type RefObject, useState, useEffect } from 'react';

// custom hook to load the map pin image. Returns imageLoaded
export function usePinImage(mapRef: RefObject<MapRef | null>, mapLoaded: boolean): boolean {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return imageLoaded;
}