import { type PropsWithChildren, type ChangeEventHandler} from "react";

interface RadioProps extends PropsWithChildren {
  id: string
  name: string
  value: string | number | readonly string[] | undefined
  checked: boolean
  disabled?: boolean
  onChange: ChangeEventHandler<HTMLInputElement>
}

export default function Radio({ children, id, name, value, checked = false, disabled = false, onChange }: RadioProps){
  return (
    <div>
      <input type="radio" id={id} name={name} value={value}
        className="mx-2 accent-slate-500"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      <label htmlFor={id}>
        {children}
      </label>
    </div>
  );
}