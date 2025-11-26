import { useEffect, useState } from "react";
import { FaRegClock } from "react-icons/fa6";
import useMapStore from "../store/useMapStore";

const SafariTimer = () => {
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("00:00:00");

  const [startTime] = useState(() => new Date());

  const setSafariDuration = useMapStore((state) => state.setSafariDuration);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const fiTime = now.toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Helsinki",
      });
      setTime(fiTime);

      const diffMs = now.getTime() - startTime.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);

      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
        2,
        "0",
      );
      const seconds = String(totalSeconds % 60).padStart(2, "0");

      setDuration(`${hours}:${minutes}:${seconds}`);
      setSafariDuration(`${hours}:${minutes}:${seconds}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime, setSafariDuration]);

  return (
    <div className="absolute top-5 self-center flex items-center p-2 bg-white/95 rounded-full shadow-lg">
      <div className="bg-deep-violet-navy/10 p-4 text-2xl rounded-full flex items-center justify-center mr-2 animate-pulse">
        <FaRegClock className="text-deep-violet-navy" />
      </div>
      <div className="flex flex-col mr-4 gap-0 p-0 text-center">
        <p className="text-deep-violet-navy text-sm p-0">{time}</p>
        <p className="text-deep-violet-navy font-bold text-lg p-0">
          {duration}
        </p>
      </div>
    </div>
  );
};

export default SafariTimer;
