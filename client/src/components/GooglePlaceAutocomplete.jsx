import { useEffect, useRef } from "react";

export default function GooglePlaceAutocomplete({
  placeholder = "Search address...",
  onPlaceSelect,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let autocomplete;

    const initialize = async () => {
      // Wait until Google Maps is loaded
      if (!window.google?.maps) {
        setTimeout(initialize, 100);
        return;
      }

      await window.google.maps.importLibrary("places");

      autocomplete = new window.google.maps.places.PlaceAutocompleteElement();

      autocomplete.setAttribute("placeholder", placeholder);

      autocomplete.style.width = "100%";

      autocomplete.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: [
              "formattedAddress",
              "location",
            ],
          });

          onPlaceSelect({
            address: place.formattedAddress,
            latitude: place.location.lat(),
            longitude: place.location.lng(),
          });
        }
      );

      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(autocomplete);
    };

    initialize();

    return () => {
      if (autocomplete && containerRef.current?.contains(autocomplete)) {
        containerRef.current.removeChild(autocomplete);
      }
    };
  }, [placeholder, onPlaceSelect]);

  return <div ref={containerRef} />;
}