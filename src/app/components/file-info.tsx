interface FileInfoProps {
  hasData: boolean
  filename: string
  error: string
}

export default function FileInfo({ hasData, filename, error }: FileInfoProps) {
  return (
    <div>
      {error ? (
        <>
          <p className="font-light text-xl text-center py-4">
            Failed to import data from "{filename}"
          </p>
          <p className="text-red-600 font-bold text-center">
            {error}
          </p>
        </>
      ) : hasData ? (
        <p className="font-light text-xl text-center py-4">
          Successfully imported data from "{filename}"
        </p>
      ) : (
        <p className="font-light text-xl text-center py-4">
          Nothing imported yet.
        </p>
      )}
    </div>
  );
}