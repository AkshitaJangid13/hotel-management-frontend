"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

declare global {
  interface Window {
    google: any;
  }
}

type Props = {
  value: string;
  onChange: (val: string) => void;
  onSelect: (data: { address: string; lat: number; lng: number }) => void;
  open?: boolean;
};

const loadGoogleMapsAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.google) return resolve();
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

const GoogleAddressInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, onSelect, open }, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<any>(null);
    const isSelectingRef = useRef(false);
    const [inputValue, setInputValue] = useState(value);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    useEffect(() => {
      setInputValue(value);
    }, [value]);

    useEffect(() => {
      if (!inputRef.current) return;

      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }

      let isMounted = true;

      loadGoogleMapsAPI().then(() => {
        if (!isMounted || !inputRef.current) return;

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "in" },
          }
        );

        autocompleteRef.current = autocomplete;

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (!place?.geometry?.location) return;

          isSelectingRef.current = true;

          const address = place.formatted_address || "";
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          setInputValue(address);
          onChange(address);
          onSelect({ address, lat, lng });

          setTimeout(() => {
            isSelectingRef.current = false;
          }, 300);
        });

        // ✅ block pac-container mousedown AFTER it's added to DOM
        setTimeout(() => {
          const pacContainers = document.querySelectorAll(".pac-container");
          pacContainers.forEach((container) => {
            container.addEventListener("mousedown", (e) => {
              e.preventDefault();
              e.stopPropagation();
            });
          });
        }, 500);
      });

      return () => {
        isMounted = false;
        if (autocompleteRef.current && window.google) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
        autocompleteRef.current = null;
      };
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          if (isSelectingRef.current) return;
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search address..."
        autoComplete="off"
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
      />
    );
  }
);

GoogleAddressInput.displayName = "GoogleAddressInput";

export default GoogleAddressInput;