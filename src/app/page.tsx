import Header from './components/header';
import Map from './components/map';
import Sidebar from './components/sidebar';

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex flex-1">
        <div className="w-[80%] h-full">
          <Map />
        </div>
        <div className="w-[20%] h-full">
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
