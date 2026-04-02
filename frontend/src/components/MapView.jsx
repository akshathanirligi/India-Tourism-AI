import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function MapView({ latitude, longitude, placeName }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        📍 Location
      </h2>

      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={true}
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <b>{placeName}</b>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default MapView;