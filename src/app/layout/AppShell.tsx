import LoginPage from "@/pages/LoginPage";
import MapPage from "@/pages/MapPage";
import SetupPage from "@/pages/SetupPage";
import PWABadge from "@/app/pwa/PWABadge";
import { Navigate, Route, Routes } from "react-router";

export default function AppShell() {
  return (
    <>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="setup" element={<SetupPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <PWABadge />
    </>
  );
}
