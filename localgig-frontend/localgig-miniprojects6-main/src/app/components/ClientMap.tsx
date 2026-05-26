import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

interface Props {
  latLng?: { lat: number; lng: number };
  setLatLng?: (pos: { lat: number; lng: number }) => void;
  lat?: number;
  lng?: number;
}

// Fix marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapClick({ setLatLng }: any) {

  useMapEvents({
    click(e) {
      if (setLatLng) {
        setLatLng({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    }
  });

  return null;
}

export default function ClientMap({ latLng, setLatLng, lat, lng }: Props) {

  const center =
    latLng
      ? [latLng.lat, latLng.lng]
      : lat && lng
      ? [lat, lng]
      : [11.8745, 75.3704];

  return (

    <MapContainer
      center={center as any}
      zoom={13}
      style={{ height: "280px", width: "100%", marginTop: "10px", borderRadius: "10px" }}
    >

      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {setLatLng && <MapClick setLatLng={setLatLng} />}

      {(latLng || lat) && (

        <Marker
          position={
            latLng
              ? [latLng.lat, latLng.lng]
              : [lat as number, lng as number]
          }
        />

      )}

    </MapContainer>

  );
}