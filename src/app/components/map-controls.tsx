import Radio from "./radio"

interface MapControlsProps {
  renderPins: boolean
  toggleRenderPins: () => void
}

export default function MapControls({ renderPins, toggleRenderPins }: MapControlsProps){
  return (
    <div className="absolute top-2 left-2 bg-white rounded-md p-1 shadow-md outline-2 outline-black/10 text-base text-black">
      <h2>Icon type:</h2>
      <Radio
        id="select-pin"
        name="icon-type"
        value="pin"
        checked={renderPins}
        onChange={toggleRenderPins}
      >Pin</Radio>
      <Radio
        id="select-dot"
        name="icon-type"
        value="dot"
        checked={!renderPins}
        onChange={toggleRenderPins}
      >Dot</Radio>
    </div>
  )
}