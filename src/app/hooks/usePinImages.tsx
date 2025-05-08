import { type MapRef } from "react-map-gl/maplibre";
import { type RefObject, useState, useEffect } from 'react';

// custom hook to load the map pin images. Returns imageLoaded
// Since using Maplibre, must load image for each color, instead of one recolorable SDF icon
export function usePinImages(mapRef: RefObject<MapRef | null>, mapLoaded: boolean): boolean {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // load map pin image
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if(!mapLoaded || !map) return;

    // check if we already have image
    if(map.hasImage('pin-dark') && map.hasImage('pin-light')){
      setImagesLoaded(true);
      return;
    }

    // load images simultaneously
    Promise.all([
      map.loadImage('/pin-dark-40.png'),
      map.loadImage('/pin-light-40.png')
    ])
      .then(([dark, light]) => {
        if(!dark || !light){
          console.error('Failed to load pin images');
          setImagesLoaded(false);
          return;
        }
        if(!map.hasImage('pin-dark')){
          map.addImage('pin-dark', dark.data);
        }
        if(!map.hasImage('pin-light')){
          map.addImage('pin-light', light.data);
        }
        setImagesLoaded(true);
      })
      .catch(error => {
        console.error('Failed to load pin images', error)
      });
      
  }, [mapRef, mapLoaded]);

  return imagesLoaded;
}