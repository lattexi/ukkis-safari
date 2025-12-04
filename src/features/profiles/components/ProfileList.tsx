import ProfileCard from "@/features/profiles/components/ProfileCard";
import useSettingsStore from "@/features/settings/store/useSettingsStore";
import { Profile } from "@/shared/types/profiles";
import { useEffect, useState } from "react";

const ProfileList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const token = useSettingsStore((state) => state.apiKey);
  const apiUrl = useSettingsStore((state) => state.apiUrl);

  // 20 mock user profiles for testing purposes, for data cards
  const mockProfiles: Profile[] = Array.from({ length: 20 }, (_, index) => ({
    id: (index + 1).toString(),
    name: `User ${index + 1}`,
    uniqueId: `unique-id-${index + 1}`,
    attributes: {
      Safarit: Math.floor(Math.random() * 10), // Random safari count between 0-9
    },
  }));

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

        // #### Testing updating driver attributes as JSON ####

        // const jsonData = data[1].attributes.Asetukset;
        // const parsedData = JSON.parse(jsonData);
        // console.log("jsonData type: ", typeof jsonData);
        // console.log("jsonData: ", jsonData);
        // console.log("parsedData type: ", typeof parsedData.Ajoneuvot);
        // console.log("parsedData: ", parsedData.Ajoneuvot);

        // // console.log("parsedData before push: ", parsedData);
        // parsedData.Ajoneuvot.push(8);

        // // console.log("parsedData after push: ", parsedData);

        // const jsonTestRes = await fetch(
        //   `${import.meta.env.VITE_TRACCAR_API_URL}/drivers/${data[1].id}`,
        //   {
        //     method: "PUT",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${import.meta.env.VITE_TRACCAR_API_TOKEN}`,
        //       // Authorization: `Basic ${btoa(`${import.meta.env.VITE_TRACCAR_EMAIL}:${import.meta.env.VITE_TRACCAR_PASSWORD}`)}`,
        //     },
        //     body: JSON.stringify({
        //       id: data[1].id,
        //       name: data[1].name,
        //       uniqueId: data[1].uniqueId,
        //       attributes: {
        //         Safarit: data[1].attributes.Safarit,
        //         Asetukset: JSON.stringify(parsedData),
        //       },
        //     }),
        //   },
        // );
        // const updatedData = await jsonTestRes.json();
        // console.log("Updated driver data:", updatedData);
        setProfiles(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-64px-96px)] pb-24">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          id={Number(profile.id)}
          name={profile.name}
          uniqueId={profile.uniqueId}
          safariCount={profile.attributes.Safarit}
        />
      ))}
      {/* {mockProfiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          id={Number(profile.id)}
          name={profile.name}
          uniqueId={profile.uniqueId}
          safariCount={profile.attributes.Safarit}
        />
      ))} */}
    </div>
  );
};

export default ProfileList;
