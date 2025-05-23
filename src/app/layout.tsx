import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "./components/header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "200"
});

const title = "Instant Map";
const siteName = 'instant-map.vercel.app';
const description = "Transform a list of addresses or coordinates into an interactive map feature in seconds!";
const url = "https://instant-map.vercel.app/";
const iconUrl = `${url}favicon.ico`;
const thumbnailUrl = `${url}instant-map-thumbnail.jpg`;
const author = {
  name: "Brendan Deneen",
  url: 'https://bd2720.github.io/',
};
const keywords = [
  'instant visualization', 'instant map', 'mapper', 'instant mapper', 'mapbox', 'geocoder', 'map addresses', 'geocode addresses',
  'map csv', 'map xlsx', 'map xml', 'map json', 'map geojson', 'file to map', 'map file', 'mapping tool', 'free mapping tool', 'free mapper', 'free geocoder',
  'address mapper', 'coordinate mapper', 'interactive map', 'interactive map feature', 'map feature',
];

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: description,
  icons: {
    icon: {
      rel: "icon",
      url: iconUrl,
      sizes: "96x96",
      type: "image/x-icon",
    },
    apple: iconUrl,
  },
  authors: [author],
  keywords: keywords,
  openGraph: {
    title: title,
    description: description,
    url: url,
    siteName: siteName,
    images: [
      {
        url: thumbnailUrl,
        width: 1200,
        height: 630,
        alt: "Instant Map",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [thumbnailUrl],
  },
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
