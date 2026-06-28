import { useState } from "react";

import CustomerNavbar from "../components/CustomerNavbar";
import GooglePlaceAutocomplete from "../components/GooglePlaceAutocomplete";

export default function TestAutocomplete() {
  const [place, setPlace] = useState(null);

  return (
    <>
      <CustomerNavbar />

      <div
        style={{
          maxWidth: "700px",
          margin: "40px auto",
        }}
      >
        <h2>Google Places Test</h2>

        <GooglePlaceAutocomplete
          placeholder="Search address..."
          onPlaceSelect={(location) => {
            console.log(location);

            setPlace(location);
          }}
        />

        {place && (
          <pre
            style={{
              marginTop: 30,
              padding: 20,
              background: "#f3f4f6",
              borderRadius: 12,
            }}
          >
            {JSON.stringify(place, null, 2)}
          </pre>
        )}
      </div>
    </>
  );
}