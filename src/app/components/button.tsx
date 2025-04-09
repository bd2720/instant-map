import { type PropsWithChildren } from "react";

interface ButtonProps extends PropsWithChildren {
  onClick?: () => void
}

export default function Button({ children, onClick }: ButtonProps){
  return (
    <button
      type="button"
      className="size-fit bg-slate-200 rounded-sm text-xl text-slate-500 font-bold p-2 hover:cursor-pointer hover:bg-slate-200/80 active:bg-slate-200/60"
      onClick={onClick}
    >
      {children}
    </button>
  )
}