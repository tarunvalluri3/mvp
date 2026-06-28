import { Map, Marker } from "@vis.gl/react-google-maps";

export default function GoogleMap({ latitude, longitude, zoom = 15 }) {
  if (latitude == null || longitude == null) {
    return (
      <div
        style={{
          height: "350px",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
        }}
      >
        Location not available
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "350px",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <Map
        center={{
          lat: Number(latitude),
          lng: Number(longitude),
        }}
        zoom={zoom}
      >
        <Marker
          position={{
            lat: latitude,
            lng: longitude,
          }}
          key={`${latitude}-${longitude}`}
        />
      </Map>
    </div>
  );
}
