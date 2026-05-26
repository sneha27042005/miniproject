import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Navigation, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


interface JobLocationMapProps {
  jobTitle: string;
  location: string;
  coordinates: { lat: number; lng: number };
  onClose: () => void;
}

export function JobLocationMap({ jobTitle, location, coordinates, onClose }: JobLocationMapProps) {
  const handleGetDirections = () => {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-1">{jobTitle}</h3>
            <p className="text-blue-100 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              {location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map */}
        <div className="h-[400px] relative">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[coordinates.lat, coordinates.lng]}>
              <Popup>
                <div className="text-center p-2">
                  <p className="font-semibold">{jobTitle}</p>
                  <p className="text-sm text-gray-600">{location}</p>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={handleGetDirections}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Get Directions (Google Maps)
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
            >
              Close
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Click "Get Directions" to open navigation in Google Maps
          </p>
        </div>
      </div>
    </div>
  );
}
