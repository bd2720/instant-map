import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "200"
});


export const metadata: Metadata = {
  title: "Instant Map",
  description: "Transform a list of addresses into an interactive map feature in seconds!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <div className="h-screen flex flex-col">
          <Header/>
          {children}
        </div>
      </body>
    </html>
  );
}
