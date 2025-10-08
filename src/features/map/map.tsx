import { useEffect, useRef } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const customMarker = document.createElement("div");
  customMarker.style.backgroundImage = "url('src/shared/img/vitunMarker.png')";
  customMarker.style.width = "40px";
  customMarker.style.height = "40px";
  customMarker.style.backgroundSize = "contain";
  customMarker.style.backgroundRepeat = "no-repeat";

  const äitisvittu = document.createElement("div");
  äitisvittu.style.backgroundImage = "url('src/shared/img/vitunMarker.png')";
  äitisvittu.style.width = "40px";
  äitisvittu.style.height = "40px";
  äitisvittu.style.backgroundSize = "contain";
  äitisvittu.style.backgroundRepeat = "no-repeat";

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [28.244297, 64.739724],
      zoom: 13,
    });

    new Marker({ element: customMarker, draggable: true })
      .setLngLat([28.244297, 64.739724])
      .addTo(mapRef.current);

    new Marker({ element: äitisvittu, draggable: true })
      .setLngLat([28.254298, 64.739725])
      .addTo(mapRef.current);

    mapRef.current.flyTo({ center: [28.244297, 64.739724], zoom: 13 });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
