import { useEffect, useRef } from "react";
import maplibregl, { Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (mapRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [28.244297, 64.739724],
      zoom: 13,
    });

    new Marker({ color: "red", draggable: true })
      .setLngLat([28.244297, 64.739724])
      .addTo(mapRef.current);

    new Marker({ color: "blue", draggable: true })
      .setLngLat([28.254298, 64.739725])
      .addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />;
}
