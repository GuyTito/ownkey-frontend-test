import { APIProvider } from "@vis.gl/react-google-maps";
import { PropsWithChildren } from "react";

const MapProvider = ({ children }: PropsWithChildren) => {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}>
      {children}
    </APIProvider>
  );
};

export default MapProvider;
