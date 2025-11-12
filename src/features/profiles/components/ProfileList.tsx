import ProfileCard from "@/features/profiles/components/ProfileCard";
import useSettingsStore from "@/features/settings/store/useSettingsStore";
import { Profile } from "@/shared/types/profiles";
import { useEffect, useState } from "react";

const ProfileList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const token = useSettingsStore((state) => state.apiKey);
  const apiUrl = useSettingsStore((state) => state.apiUrl);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`${apiUrl}/drivers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }

        const data = await response.json();
        console.log(data);
        setProfiles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-64px-96px)] pb-10">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          id={Number(profile.id)}
          name={profile.name}
          uniqueId={profile.uniqueId}
          safariCount={profile.attributes.Safarit}
        />
      ))}
    </div>
  );
};

export default ProfileList;
