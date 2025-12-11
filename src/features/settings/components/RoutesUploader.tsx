import { deleteData, fetchData, postData } from "@/shared/utils/fetchData";
import { useEffect, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const RoutesUploader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [routeName, setRouteName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [routes, setRoutes] = useState<any[]>([]);

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  async function fetchRoutes() {
    const data = fetchData(`${import.meta.env.VITE_SERVER_IP}/routes`);
    setRoutes(await data);
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Valitse ensin tiedosto");
      return;
    }
    if (!routeName.trim()) {
      alert("Aseta reitille nimi");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", routeName);

      console.log("Uploading file:", file.name, "with route name:", routeName);

      const res = await postData(
        `${import.meta.env.VITE_SERVER_IP}/routes`,
        formData,
      );

      console.log("Server response:", res);
      if (res.error) {
        throw new Error(res.error);
      }

      setFile(null);
      setRouteName("");
      fetchRoutes();
      alert("Tiedosto ladattu!");
    } catch (err) {
      console.error(err);
      alert("Tiedoston lähetys epäonnistui");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRoute = async (routeName: string) => {
    try {
      await deleteData(`${import.meta.env.VITE_SERVER_IP}/routes/${routeName}`);
      fetchRoutes();
    } catch (err) {
      console.error(err);
      alert("Reitin poisto epäonnistui");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <div>
        <p className="text-lg font-medium text-dark-navy-purple">
          Lataa kelkkareittejä
        </p>
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex w-full bg-icy-mint/50 border border-gray-300 rounded-lg px-4 py-3 items-center gap-2">
          <FaFileUpload className="text-dark-navy-purple" size={20} />

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="cursor-pointer"
            onClick={handleChooseFileClick}
          >
            <p className="ml-2 underline text-dark-navy-purple">
              Klikkaa valitaksesi tiedoston
            </p>
          </button>

          {file && (
            <p className="ml-4 text-sm text-dark-navy-purple truncate max-w-[200px]">
              {file.name}
            </p>
          )}
        </div>
        <div className="relative my-2 flex items-center gap-2">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            <FaPencil className="text-dark-navy-purple" size={20} />
          </div>

          <input
            type="text"
            value={routeName}
            autoComplete="off"
            onChange={(e) => setRouteName(e.target.value as any)}
            className="w-full bg-icy-mint/50 rounded-lg py-3 pl-12 pr-4 border border-gray-300 text-dark-navy-purple"
            placeholder="Aseta reitin nimi"
          ></input>

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="ml-auto px-4 cursor-pointer py-2 rounded-lg shadow-md hover:bg-dark-navy-purple bg-icy-blue disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <p>{isUploading ? "Tallennetaan..." : "Tallenna"}</p>
          </button>
        </div>
        <p className="text-sm text-dark-navy-purple mb-2">
          Aseta reitille nimi
        </p>
      </div>
      <div className="pt-2">
        <p className="text-lg font-medium text-dark-navy-purple">
          Ladatut kellareitit
        </p>
      </div>
      <div>
        {/* LIST OF ROUTES */}
        <div className="flex flex-col gap-2">
          {routes ? (
            routes.map((route, index) => (
              <div
                key={index}
                className="w-full flex items-center justify-between bg-icy-mint/50 rounded-lg px-4 py-3 border border-gray-300"
              >
                <p className="text-dark-navy-purple font-semibold">
                  {route.name}
                </p>
                <button
                  type="button"
                  onClick={() => handleDeleteRoute(route.name)}
                  className="px-4 py-2 rounded-lg shadow-md hover:bg-danger-text bg-danger-badge text-white cursor-pointer"
                >
                  Poista reitti
                </button>
              </div>
            ))
          ) : (
            <p className="text-dark-navy-purple text-sm">
              Reittejä ei löytynyt
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutesUploader;
