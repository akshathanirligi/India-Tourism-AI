import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMap({ latitude, longitude, placeName }) {
  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "15px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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

export default LocationMap;