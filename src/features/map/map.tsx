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
  const userHeadingRef = useRef<number | null>(null);
  const headingSourceRef = useRef<"geo" | "compass" | null>(null);

  const api = useSettingsStore((state) => state.apiUrl);
  const token = useSettingsStore((state) => state.apiKey);

  // Valitut ajoneuvot Zustandista
  const selectedVehicleIds = useVehicleStore(
    (s) => s.selectedVehicleIds,
    shallow, // ✅ equalityFn
  );
  // 2) Tee Set vain kun taulukko oikeasti muuttuu
  useEffect(() => {
    selectedIdsRef.current = new Set<number>(selectedVehicleIds.map(Number));
    console.log("Selected IDs on map:", selectedIdsRef.current);
  }, [selectedVehicleIds]);

  const setMapBearing = (deg: number) => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({ bearing: deg, duration: 150 });
  };

  const updateUserMarker = (lng: number, lat: number) => {
    if (!mapRef.current) return;

    let m = userMarkerRef.current;
    if (!m) {
      m = new maplibregl.Marker({
        element: createUserMarkerElement("#0ea5e9"), // oma väri tänne
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
    } else {
      m.setLngLat([lng, lat]);
    }
  };

  const fitToSelected = () => {
    if (!mapRef.current) return;
    const bounds = new maplibregl.LngLatBounds();
    let has = false;

    // 1) valitut ajoneuvot
    for (const [id, pos] of lastPosRef.current) {
      if (selectedIdsRef.current.has(id)) {
        bounds.extend([pos.longitude, pos.latitude]);
        has = true;
      }
    }

    // 2) oma sijainti
    const up = userPosRef.current;
    if (up) {
      bounds.extend([up.coords.longitude, up.coords.latitude]);
      has = true;
    }

    if (has) {
      mapRef.current.fitBounds(bounds, {
        padding: 140,
        maxZoom: 16,
        duration: 600,
      });
    }
  };

  useEffect(() => {
    // 1) Luo kartta
    const map = new maplibregl.Map({
      container: containerRef.current as HTMLDivElement,
      style: "https://tiles.openfreemap.org/styles/bright", // Vaihda omaan tyylitiedostoon jos haluat
      center: [24.941, 60.173], // Helsinki default
      zoom: 11,
    });
    mapRef.current = map;
    map.on("error", (e) => {
      console.error("MapLibre error event:", e.error);
    });

    let firstUserFix = true;
    let watchId: number | null = null;
    const cleanupFns: Array<() => void> = [];

    // 5a) GPS watch: sijainti + mahdollinen heading liikkeessä
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          userPosRef.current = pos;
          const { latitude, longitude, heading } = pos.coords;

          // Päivitä oma markkeri
          updateUserMarker(longitude, latitude);

          // Käytä GPS-headingiä jos saatavilla (yleensä vain liikkeessä)
          if (typeof heading === "number" && isFinite(heading)) {
            userHeadingRef.current = heading;
            headingSourceRef.current = "geo";
            setMapBearing(heading);
          }

          if (firstUserFix) {
            firstUserFix = false;
            fitToSelected();
          }
        },
        (err) => {
          console.warn("Geolocation error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
      );
    }

    const enableCompass = () => {
      const handle = (ev: DeviceOrientationEvent) => {
        const iosHeading = (ev as any).webkitCompassHeading as
          | number
          | undefined;
        const alpha = ev.alpha as number | null;

        let heading: number | null = null;
        if (typeof iosHeading === "number") {
          heading = iosHeading; // iOS: 0 = pohjoinen, myötäpäivään
        } else if (typeof alpha === "number") {
          heading = 360 - alpha; // Android/Chrome: muunnos
        }

        if (heading == null || !isFinite(heading)) return;

        if (headingSourceRef.current !== "geo") {
          userHeadingRef.current = heading;
          headingSourceRef.current = "compass";
          setMapBearing(heading);
        }
      };

      window.addEventListener("deviceorientation", handle, true);
      cleanupFns.push(() =>
        window.removeEventListener("deviceorientation", handle, true),
      );
    };

    const tryStartCompass = () => {
      const D: any = (window as any).DeviceOrientationEvent;

      // iOS: requestPermission on pakollinen ja se täytyy tehdä käyttäjän eleestä
      if (D && typeof D.requestPermission === "function") {
        const el = containerRef.current!;
        const ask = async () => {
          try {
            const res = await D.requestPermission();
            if (res === "granted") enableCompass();
          } catch {
            // ignore
          }
        };
        const onFirstGesture = () => {
          ask();
          el.removeEventListener("click", onFirstGesture);
          el.removeEventListener("touchstart", onFirstGesture);
        };
        el.addEventListener("click", onFirstGesture, { once: true });
        el.addEventListener("touchstart", onFirstGesture, { once: true });
        // Ei näy nappeja; kompassi aktivoituu heti kun käyttäjä koskettaa karttaa.
      } else {
        // Android/Chrome/desktop: suoraan päälle
        enableCompass();
      }
    };

    tryStartCompass();

    // 2) Yhdistä Traccariin WebSocketilla

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
        code: ev.code, // esim. 1006 = abnormal closure (usein handshake fail)
        reason: ev.reason, // jos proxy/serveri antaa syyn
        wasClean: ev.wasClean,
      });
    };

    const upsertMarker = (p: TraccarPosition) => {
      if (!mapRef.current) return;

      // Päivitä välimuisti aina, jotta saadaan marker takaisin näkyviin jos valinta muuttuu
      lastPosRef.current.set(p.deviceId, p);

      // Jos laite EI ole valittuna -> poista/piilota marker ja poistu
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
    };

    ws.onmessage = (msg) => {
      try {
        const data: TraccarSocketPayload = JSON.parse(msg.data as string);

        // Tilanne 1: initial snapshot { devices:[], positions:[] }
        if (typeof data === "object" && "positions" in data) {
          const positions = data.positions ?? [];
          positions.forEach(upsertMarker);
          fitToSelected();
          return;
        }

        // Tilanne 2: yksittäinen päivitys (usein position-objekti)
        const maybePosition = data as Partial<TraccarPosition>;
        if (
          typeof maybePosition === "object" &&
          typeof maybePosition.deviceId === "number" &&
          typeof maybePosition.latitude === "number" &&
          typeof maybePosition.longitude === "number"
        ) {
          upsertMarker(maybePosition as TraccarPosition);
        }
        // (Laitteiden metat päivittyvät joskus yksittäin – niitä ei tarvita markkerin piirtämiseen)
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
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default LiveMap;
