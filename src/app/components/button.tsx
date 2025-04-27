import { type PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
  disabled?: boolean
  onClick?: () => void
}

export default function Button({ children, disabled = false, onClick }: ButtonProps){
  return (
    <button
      type="button"
      className="size-fit bg-slate-200 rounded-sm text-xl text-slate-500 font-bold p-2 hover:enabled:cursor-pointer hover:bg-slate-200/80 active:bg-slate-200/60 disabled:bg-slate-300 disabled:text-slate-500/60"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}