import ProfileCard from "@/features/profiles/components/ProfileCard";
import { Profile } from "@/shared/types/profiles";
import { useEffect, useState } from "react";

const ProfileList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_TRACCAR_API_URL}/drivers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
            },
          },
        );

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          name={profile.name}
          uniqueId={profile.uniqueId}
          safariCount={profile.attributes.Safarit}
        />
      ))}
    </div>
  );
};

export default ProfileList;
