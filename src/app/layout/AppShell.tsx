import MapPage from "@/pages/MapPage";
import SetupPage from "@/pages/SetupPage";
// import PWABadge from "@/app/pwa/PWABadge";
import { Navigate, Route, Routes } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

export default function AppShell() {
  return (
    <>
      <Routes>
        {/* <Route index element={<ProfilePage />} /> */}
        <Route index path="/~miikavs/ukkis/profile" element={<ProfilePage />} />
        <Route path="/~miikavs/ukkis/map" element={<MapPage />} />
        <Route path="/~miikavs/ukkis/setup" element={<SetupPage />} />
        <Route path="/~miikavs/ukkis/error" element={<ErrorPage />} />
        <Route path="/~miikavs/ukkis/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/~miikavs/ukkis/profile" />} />
      </Routes>
      {/* <PWABadge /> */}
    </>
  );
}
