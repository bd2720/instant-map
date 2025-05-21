import Image from "next/image";
import Link from "next/link";

export default function Header(){
  return (
    <header className="h-20 bg-slate-600 shrink-0 relative">
      <div className="size-full flex justify-start md:justify-center items-center px-8">
        <Link href="/" title="Home" className="flex gap-2">
          <Image 
            src="/favicon.ico" 
            alt="Logo" 
            width="96" 
            height="96" 
            className="size-10"
          />
          <h1 className="text-4xl font-light">
            Instant Map
          </h1>
        </Link>
      </div>
      <Link href="/about" title="More info & usage guide" className="text-lg font-semibold absolute right-8 top-6 hover:underline visited:text-slate-200">
        About
      </Link>
    </header>
  );
}