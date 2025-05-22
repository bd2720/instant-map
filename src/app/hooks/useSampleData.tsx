import { useRef, type RefObject } from 'react';

export function useSampleData(fileInputRef: RefObject<HTMLInputElement | null>, filename: string, setError: (e: string) => void, setLoading: (l: boolean) => void){
  // ref to abort controller for loading sample file
  const abortControllerRef = useRef<AbortController>(null);

  // handle sample file upload (upload to file input)
  return () => {
    if(abortControllerRef.current){
      abortControllerRef.current.abort("Request overridden");
    }

    abortControllerRef.current = new AbortController();

    fetch(filename, { signal: abortControllerRef.current.signal })
      .then(res => res.blob())
      .then(blob => {
        // create new File + FileTransfer
        const file = new File([blob], filename);
        const transfer = new DataTransfer();
        transfer.items.add(file);
        // add file to HTML input element through FileTransfer
        if(!fileInputRef.current) return;
        fileInputRef.current.files = transfer.files;
        // generate synthetic change Event
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        // no longer loading sample file
        abortControllerRef.current = null;
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : "Error loading sample data.");
        console.error('Error loading sample data:', err);
      })
      .finally(() => setLoading(false))
  }
}