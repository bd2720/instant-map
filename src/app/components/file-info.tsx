interface FileInfoProps {
  hasData: boolean
  numFeatures: number | undefined
  filename: string
  error: string
}

export default function FileInfo({ hasData, numFeatures, filename, error }: FileInfoProps) {
  return (
    <div className="py-4">
      {error ? (
        <>
          <p className="font-light text-xl text-center">
            Failed to import data from "{filename}"
          </p>
          <p className="text-red-600 font-bold text-center py-2">
            {error}
          </p>
        </>
      ) : !hasData ? (
        <p className="font-light text-xl text-center">
          Nothing imported yet.
        </p>
      ) : (
        <>
          <p className="font-light text-xl text-center">
            Successfully imported data from "{filename}"
          </p>
          {numFeatures !== undefined && (
            <p className="text-green-300 text-lg text-center py-2">
              <span className="font-bold">{numFeatures}</span> feature{numFeatures !== 1 && 's'} imported
            </p>
          )}
        </>
      )}
    </div>
  );
}