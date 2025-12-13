import MapPage from "@/pages/MapPage";
import SetupPage from "@/pages/SetupPage";
// import PWABadge from "@/app/pwa/PWABadge";
import { Navigate, Route, Routes } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

export default function AppShell() {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
