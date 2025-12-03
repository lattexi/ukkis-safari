import ProfileList from "@/features/profiles/components/ProfileList";
import ProfileSummary from "@/features/profiles/components/ProfileSummary";
import Header from "@/shared/components/Header";
// import Searchbar from "@/shared/components/Searchbar";
import { useState } from "react";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setIsLoading(true);
    // Simulate a loading process
    setTimeout(() => {
      setIsLoading(false);
      navigate("/~miikavs/ukkis/setup");
    }, 2000);
  };

  return (
    <div className="w-full h-screen bg-icy-mint overflow-hidden">
      <Header title="Valitse safarin vetäjä" settingsButton />

      <div className="p-4 space-y-4 flex flex-col gap-6 px-20">
        {/* Searchbar functionality coming soon!! */}
        {/* <Searchbar
          placeholder="Hae käyttäjää..."
          className=" m-auto max-w-[720px] w-full"
        /> */}
        <ProfileList />
      </div>
      <ProfileSummary isLoading={isLoading} onStart={handleStart} />
    </div>
  );
};
export default ProfilePage;
