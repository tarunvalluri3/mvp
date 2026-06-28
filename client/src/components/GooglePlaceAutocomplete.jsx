import { useEffect, useRef } from "react";

export default function GooglePlaceAutocomplete({
  placeholder = "Search address...",
  onPlaceSelect,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    let autocompleteElement;

    async function init() {
      const { PlaceAutocompleteElement } =
        await google.maps.importLibrary("places");

      autocompleteElement = new PlaceAutocompleteElement();

      autocompleteElement.setAttribute(
        "placeholder",
        placeholder
      );

      autocompleteElement.style.width = "100%";

      autocompleteElement.addEventListener(
        "gmp-select",
        async ({ placePrediction }) => {
          const place = placePrediction.toPlace();

          await place.fetchFields({
            fields: [
              "displayName",
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

      containerRef.current.appendChild(
        autocompleteElement
      );
    }

    init();

    return () => {
      if (
        autocompleteElement &&
        containerRef.current?.contains(autocompleteElement)
      ) {
        containerRef.current.removeChild(
          autocompleteElement
        );
      }
    };
  }, [placeholder, onPlaceSelect]);

  return <div ref={containerRef} />;
}