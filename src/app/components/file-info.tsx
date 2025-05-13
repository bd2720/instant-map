interface FileInfoProps {
  hasData: boolean
  numFeatures: number | undefined
  filename: string
  error: string
  loading: boolean
}

export default function FileInfo({ hasData, numFeatures, filename, error, loading }: FileInfoProps) {
  return (
    <div className="py-4">
      {loading ? (
        <p className="font-light text-xl text-center">
          Mapping...
        </p>
      ) : error ? (
        <>
          <p className="font-light text-xl text-center">
            Failed to import data from &quot;{filename}&quot;
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
            Successfully imported data from &quot;{filename}&quot;
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