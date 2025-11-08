import LoginPage from "@/pages/LoginPage";
import MapPage from "@/pages/MapPage";
import SetupPage from "@/pages/SetupPage";
import PWABadge from "@/app/pwa/PWABadge";
import { Navigate, Route, Routes } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import ProfilePage from "@/pages/ProfilePage";

export default function AppShell() {
  return (
    <>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="map" element={<MapPage />} />
        <Route path="setup" element={<SetupPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <PWABadge />
    </>
  );
}
