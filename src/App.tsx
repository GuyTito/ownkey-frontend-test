import MapProvider from "./components/MapProvider";
import AppMap from "./components/Map";
import { useFetchLocations } from "./utils/useFetchLocations";

export type Poi = {
  id: string;
  poi: {
    name: string;
    url: string;
    phone: string;
  };
  address: {
    freeformAddress: string;
  };
  location: google.maps.LatLngLiteral;
};

export default function App() {
  const { data, isLoading, error, fetchData, clearData } =
    useFetchLocations<any>({
      query: "rental apartments",
    });
  const locations = data?.results?.map((item: any) => ({
    ...item,
    location: { ...item.position, lng: item.position.lon },
  }));

  return (
    <MapProvider>
      <div className="flex flex-col h-screen">
        <header className="text-center  mb-4">
          <h1 className="text-2xl text-pink-600 font-bold text-center uppercase">
            Ownkey Properties
          </h1>
          <p className="text-slate-500 text-sm">
            Search properties by drawing an area on the map
          </p>
        </header>

        {isLoading && (
          <div className="absolute z-30 inset-0 bg-slate-700/70 grid place-content-center">
            <div className="border-2 size-20 rounded-full border-b-transparent animate-spin" />
          </div>
        )}

        <div className="flex flex-1 h-[90%]">
          <div className="hidden md:block md:w-[40%] px-2 md:px-4 ">
            <p className="mb-3 text-slate-400">
              {locations?.length ?? 0} properties found
            </p>
            <div className="space-y-6 overflow-auto h-[92%]">
              {error && <p className="text-red-500 text-lg">{error}</p>}
              <PropertyList locations={locations} />
            </div>
          </div>
          <div className="w-full md:w-[60%]">
            <AppMap
              searchArea={fetchData}
              locations={locations}
              reset={clearData}
            />
          </div>
        </div>
      </div>
    </MapProvider>
  );
}

function PropertyList({ locations }: { locations: Poi[] }) {
  return (
    <>
      {locations?.length &&
        locations?.map((item: Poi) => (
          <div key={item.id} className="flex items-center gap-3">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRiuWbqZ9LVTVytWgfdKwaLwX8ULlnnpl18Q&s"
              alt="apartment"
              className="rounded-lg w-[50%] h-32"
            />
            <div className="w-[50%] text-xs md:text-sm text-slate-500">
              <p className="text-sm md:text-lg font-bold">{item.poi.name}</p>
              <p>{item.poi.phone}</p>
              <p>{item.address.freeformAddress}</p>
              <p>{item.poi.url}</p>
            </div>
          </div>
        ))}
    </>
  );
}
