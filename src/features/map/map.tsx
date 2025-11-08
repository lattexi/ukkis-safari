import { useEffect, useMemo, useRef } from "react";
import maplibregl, { Map as MMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import useVehicleStore from "@/features/vehicles/store/useVehicleStore";
import { shallow } from "zustand/shallow";

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

  // Valitut ajoneuvot Zustandista
  const selectedVehicleIds = useVehicleStore(
    (s) => s.selectedVehicleIds,
    shallow, // ✅ equalityFn
  );
  // 2) Tee Set vain kun taulukko oikeasti muuttuu
  const selectedIds = useMemo(
    () => new Set<number>(selectedVehicleIds.map(Number)),
    [selectedVehicleIds],
  );
  console.log("Selected IDs on map:", selectedIds);
  const isSelected = (deviceId: number) => selectedIds.has(deviceId);

  useEffect(() => {
    // 1) Luo kartta
    const map = new maplibregl.Map({
      container: containerRef.current as HTMLDivElement,
      style: "https://tiles.openfreemap.org/styles/bright", // Vaihda omaan tyylitiedostoon jos haluat
      center: [24.941, 60.173], // Helsinki default
      zoom: 11,
    });
    mapRef.current = map;

    // 2) Yhdistä Traccariin WebSocketilla
    const api = import.meta.env.VITE_TRACCAR_API_URL as string;
    const u = new URL(api);
    u.protocol = "wss:";
    u.pathname = `${u.pathname.replace(/\/$/, "")}/socket`;

    const token = import.meta.env.VITE_TRACCAR_TOKEN;
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
      if (!isSelected(p.deviceId)) {
        const existing = markersRef.current.get(p.deviceId);
        if (existing) {
          existing.remove();
          markersRef.current.delete(p.deviceId);
        }
        return;
      }

      // Muuten: piirrä/päivitä marker
      const lngLat: [number, number] = [p.longitude, p.latitude];
      let m = markersRef.current.get(p.deviceId);
      if (!m) {
        m = new maplibregl.Marker({ draggable: false })
          .setLngLat(lngLat)
          .setPopup(
            new maplibregl.Popup({ closeButton: false }).setHTML(
              `<div style="font-size:12px;">
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

    // const fitToAllMarkers = () => {
    //   const coords = [...lastPosRef.current.values()].map((p) => [
    //     p.longitude,
    //     p.latitude,
    //   ]) as [number, number][];

    //   if (!coords.length || !mapRef.current) return;

    //   const bounds = new maplibregl.LngLatBounds();
    //   coords.forEach((c) => bounds.extend(c));
    //   mapRef.current.fitBounds(bounds, {
    //     padding: 60,
    //     maxZoom: 16,
    //     duration: 600,
    //   });
    // };

    const fitToSelected = () => {
      if (!mapRef.current) return;
      const bounds = new maplibregl.LngLatBounds();
      let has = false;

      for (const [id, pos] of lastPosRef.current) {
        if (isSelected(id)) {
          bounds.extend([pos.longitude, pos.latitude]);
          has = true;
        }
      }
      if (has) {
        mapRef.current.fitBounds(bounds, {
          padding: 60,
          maxZoom: 16,
          duration: 600,
        });
      }
    };

    // (async () => {
    //   try {
    //     const res = await fetch("https://traccar.latexi.dev/api/positions", {
    //       headers: {
    //         Authorization: `Bearer ${import.meta.env.VITE_TRACCAR_TOKEN}`,
    //       },
    //     });
    //     if (!res.ok) {
    //       console.error(
    //         "Initial positions fetch failed",
    //         res.status,
    //         await res.text(),
    //       );
    //       return;
    //     }
    //     const positions: TraccarPosition[] = await res.json();
    //     positions.forEach(upsertMarker); // käyttää jo olemassa olevaa funktiotasi
    //     fitToSelected();
    //   } catch (e) {
    //     console.error("Initial positions fetch error", e);
    //   }
    // })();

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
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default LiveMap;
