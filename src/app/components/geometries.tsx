import Radio from './radio';

interface GeometriesProps {
  disabled?: boolean
  useAddress: boolean
  setUseAddress: (use: boolean) => void
}

export default function Geometries({ disabled, useAddress, setUseAddress }: GeometriesProps){
  return (
    <fieldset className="flex flex-col items-center pb-2">
          <legend className="text-xl font-weighted w-full text-center">Representation</legend>
            <Radio
              id={'addr'}
              name="geometry"
              value="t"
              checked={useAddress}
              disabled={disabled}
              onChange={() => setUseAddress(true)}
            >
              Address
            </Radio>
            <Radio
              id={'coord'}
              name="geometry"
              value="f"
              checked={!useAddress}
              disabled={disabled}
              onChange={() => setUseAddress(false)}
            >
              Coordinates
            </Radio>
    </fieldset>
  );
}