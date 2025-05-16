import NextLink from "next/link";
import { PropsWithChildren } from "react";

interface LinkProps extends PropsWithChildren {
  href: string
  title?: string
  newTab?: boolean
}

export default function Link({ href, title, newTab = false, children }: LinkProps){
  return (
    <NextLink 
      href={href} 
      title={title}
      target={newTab ? "_blank" : undefined}
      className="text-lg font-semibold hover:underline visited:text-slate-200"
    >
      {children}
    </NextLink>
  );
}