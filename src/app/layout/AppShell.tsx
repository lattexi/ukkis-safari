import MapPage from "@/pages/MapPage";
import SetupPage from "@/pages/SetupPage";
// import PWABadge from "@/app/pwa/PWABadge";
import { Navigate, Route, Routes } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

export default function AppShell() {
  const path = import.meta.env.VITE_PATH;
  return (
    <>
      <Routes>
        {/* <Route index element={<ProfilePage />} /> */}
        <Route index path={`${path}/profile`} element={<ProfilePage />} />
        <Route path={`${path}/map`} element={<MapPage />} />
        <Route path={`${path}/setup`} element={<SetupPage />} />
        <Route path={`${path}/error`} element={<ErrorPage />} />
        <Route path={`${path}/settings`} element={<SettingsPage />} />
        <Route path="*" element={<Navigate to={`${path}/profile`} />} />
      </Routes>
      {/* <PWABadge /> */}
    </>
  );
}
