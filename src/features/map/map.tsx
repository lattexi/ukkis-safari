import { useEffect, useRef } from "react";
import maplibregl, { Map as MMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { shallow } from "zustand/shallow";
import {
  createMarkerElement,
  createUserMarkerElement,
} from "@/features/map/components/Markers";
import useSettingsStore from "@/features/settings/store/useSettingsStore";
import useMapStore from "./store/useMapStore";
import { fetchData } from "@/shared/utils/fetchData";

type TraccarDevice = {
  id: number;
  name?: string;
  uniqueId?: string;
};

type TraccarPosition = {
  id: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  speed?: number;
  course?: number;
  fixTime?: string;
  attributes?: Record<string, unknown>;
};

type TraccarSocketPayload =
  | { devices?: TraccarDevice[]; positions?: TraccarPosition[] } // initial snapshot
  | TraccarDevice
  | TraccarPosition;

const LiveMap = () => {
  const mapRef = useRef<MMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const markersRef = useRef<Map<number, Marker>>(new Map());
  const lastPosRef = useRef<Map<number, TraccarPosition>>(new Map());
  const selectedIdsRef = useRef<Set<number>>(new Set());

  const userMarkerRef = useRef<Marker | null>(null);
  const userPosRef = useRef<GeolocationPosition | null>(null);
  const userHeadingRef = useRef<number | undefined>(undefined);

  const fitTimeoutRef = useRef<number | null>(null);

  const api = useSettingsStore((state) => state.apiUrl);
  const token = useSettingsStore((state) => state.apiKey);

  const selectedVehicleIds = useVehicleStore(
    (s) => s.selectedVehicleIds,
    shallow,
  );

  useEffect(() => {
    selectedIdsRef.current = new Set<number>(selectedVehicleIds.map(Number));
    console.log("Selected IDs on map:", selectedIdsRef.current);
  }, [selectedVehicleIds]);

  const updateUserMarker = (lng: number, lat: number) => {
    if (!mapRef.current) return;

    let m = userMarkerRef.current;
    if (!m) {
      m = new maplibregl.Marker({
        element: createUserMarkerElement("#0ea5e9"), // Vetäjän väri
        draggable: false,
        rotationAlignment: "map",
      })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup({ closeButton: false }).setHTML(
            `<div style="font-size:12px; color: black;">
             <strong>Oma sijainti</strong>
           </div>`,
          ),
        )
        .addTo(mapRef.current);
      userMarkerRef.current = m;

      //Update user location to map store
      const setUserCoordinates = useMapStore.getState().setUserCoordinates;
      setUserCoordinates(lat.toString(), lng.toString());
    } else {
      m.setLngLat([lng, lat]);
    }
  };

  const fitToSelected = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = new maplibregl.LngLatBounds();
    let has = false;

    // valitut ajoneuvot
    for (const [id, pos] of lastPosRef.current) {
      if (selectedIdsRef.current.has(id)) {
        bounds.extend([pos.longitude, pos.latitude]);
        has = true;
      }
    }

    // oma sijainti
    const up = userPosRef.current;
    if (up) {
      bounds.extend([up.coords.longitude, up.coords.latitude]);
      has = true;
    }

    if (!has) return;

    const paddingOptions = {
      top: 100,
      bottom: 80,
      left: 250,
      right: 120,
    };

    const opts: maplibregl.FitBoundsOptions = {
      padding: paddingOptions,
      maxZoom: 20,
      duration: 300,
    };

    const h = userHeadingRef.current;
    if (typeof h === "number" && Number.isFinite(h)) {
      opts.bearing = h;
    }

    map.fitBounds(bounds, opts);
  };

  const scheduleFitToSelected = () => {
    if (fitTimeoutRef.current !== null) return;

    fitTimeoutRef.current = window.setTimeout(() => {
      fitTimeoutRef.current = null;
      fitToSelected();
    }, 500);
  };

  const upsertMarker = (p: TraccarPosition) => {
    if (!mapRef.current) return;

    lastPosRef.current.set(p.deviceId, p);

    // Poistaa turhat markkerit
    if (!selectedIdsRef.current.has(p.deviceId)) {
      const existing = markersRef.current.get(p.deviceId);
      if (existing) {
        existing.remove();
        markersRef.current.delete(p.deviceId);
      }
      return;
    }

    const marker = createMarkerElement(p.deviceId);

    const lngLat: [number, number] = [p.longitude, p.latitude];

    //Päivitetään sijainnit map storeen
    const setVehiclesCoordinates =
      useMapStore.getState().setVehiclesCoordinates;
    setVehiclesCoordinates({
      id: p.deviceId,
      latitude: p.latitude.toString(),
      longitude: p.longitude.toString(),
    });

    let m = markersRef.current.get(p.deviceId);
    if (!m) {
      m = new maplibregl.Marker({ element: marker, draggable: false })
        .setLngLat(lngLat)
        .setPopup(
          new maplibregl.Popup({ closeButton: false }).setHTML(
            `<div style="font-size:12px; color: black; ">
             <strong>Device ${p.deviceId}</strong><br/>
             ${p.fixTime ? new Date(p.fixTime).toLocaleString() : ""}
           </div>`,
          ),
        )
        .addTo(mapRef.current);
      markersRef.current.set(p.deviceId, m);
    } else {
      m.setLngLat(lngLat);
    }

    scheduleFitToSelected();
  };

  useEffect(() => {
    const map = new maplibregl.Map({
      container: containerRef.current as HTMLDivElement,
      style: "https://tiles.openfreemap.org/styles/bright", // Kartan tyyli
      center: [24.941, 60.173],
      zoom: 11,
    });
    mapRef.current = map;
    map.on("error", (e) => {
      console.error("MapLibre error event:", e.error);
    });

    type Route = {
      name: string;
      geojson: {
        type: string;
        data: {
          type: string;
          properties: Record<string, unknown>;
          geometry: {
            type: string;
            coordinates: number[][];
          };
        };
      };
    };

    const routes: Promise<Route[]> = fetchData(
      `${import.meta.env.VITE_SERVER_IP}/routes`,
    );

    map.on("load", async () => {
      try {
        const rts = await routes;
        rts.forEach((route) => {
          map.addSource(route.name, route.geojson as any);
          map.addLayer({
            id: route.name,
            type: "line",
            source: route.name,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#FF0000",
              "line-width": 4,
            },
          });
        });
      } catch (e) {
        console.error("Failed to load routes:", e);
      }
    });

    let watchId: number | null = null;

    // GPS seuranta
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          userPosRef.current = pos;
          const { latitude, longitude, heading } = pos.coords;

          updateUserMarker(longitude, latitude);

          if (typeof heading === "number" && Number.isFinite(heading)) {
            userHeadingRef.current = heading;
          }

          scheduleFitToSelected();
        },
        (err) => {
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
      );
    }

    // Websocket yhteys
    const u = new URL(api);
    u.protocol = "wss:";
    u.pathname = `${u.pathname.replace(/\/$/, "")}/socket`;

    if (token) {
      u.searchParams.set("token", token);
    }

    const ws = new WebSocket(u.toString());

    ws.onopen = () => {
      console.log("Traccar socket open:", u.toString());
    };

    ws.onerror = (e) => {
      console.error("Traccar socket error:", e);
    };
    ws.onclose = (ev) => {
      console.warn("Traccar socket closed:", {
        code: ev.code,
        reason: ev.reason,
        wasClean: ev.wasClean,
      });
    };

    ws.onmessage = (msg) => {
      try {
        const data: TraccarSocketPayload = JSON.parse(msg.data as string);

        // Tilanne 1: initial snapshot { devices:[], positions:[] }
        if (typeof data === "object" && "positions" in data) {
          const positions = data.positions ?? [];
          positions.forEach(upsertMarker);
          scheduleFitToSelected();
          return;
        }

        // Tilanne 2: yksittäinen päivitys (position-objekti)
        const maybePosition = data as Partial<TraccarPosition>;
        if (
          typeof maybePosition === "object" &&
          typeof maybePosition.deviceId === "number" &&
          typeof maybePosition.latitude === "number" &&
          typeof maybePosition.longitude === "number"
        ) {
          upsertMarker(maybePosition as TraccarPosition);
        }
      } catch (e) {
        console.error("Failed to parse Traccar message:", e, msg.data);
      }
    };

    return () => {
      ws.close();
      map.remove();
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      lastPosRef.current.clear();
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (fitTimeoutRef.current !== null) {
        clearTimeout(fitTimeoutRef.current);
        fitTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default LiveMap;
