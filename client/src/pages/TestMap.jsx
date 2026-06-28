import CustomerNavbar from "../components/CustomerNavbar";
import GoogleMap from "../components/GoogleMap";

export default function TestMap() {
  return (
    <>
      <CustomerNavbar />

      <div
        style={{
          maxWidth: "1000px",
          margin: "40px auto",
          padding: "20px",
        }}
      >
        <h2>Google Maps Test</h2>

        <GoogleMap latitude={13.0318} longitude={80.1776} />
      </div>
    </>
  );
}
