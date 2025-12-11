import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";

const testObject = [
  {
    name: "Reitti 1",
    geojson: {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {
          name: "GPX Track",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [24.93545, 60.16952],
            [24.93645, 60.17052],
            [24.93745, 60.17152],
            [24.93845, 60.17252],
            [24.93945, 60.17352],
            [24.94045, 60.17452],
            [24.94145, 60.17552],
            [24.94245, 60.17652],
            [24.94345, 60.17752],
            [24.94445, 60.17852],
          ],
        },
      },
    },
  },
  {
    name: "Reitti 2",
    geojson: {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {
          name: "GPX Track",
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [24.95545, 60.16952],
            [24.95645, 60.17052],
            [24.95745, 60.17152],
            [24.95845, 60.17252],
            [24.95945, 60.17352],
            [24.96045, 60.17452],
            [24.96145, 60.17552],
            [24.96245, 60.17652],
            [24.96345, 60.17752],
            [24.96445, 60.17852],
          ],
        },
      },
    },
  },
];

const RoutesUploader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [routeName, setRouteName] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

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
      formData.append("routeName", routeName);

      const res = await fetch("/api/routes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setFile(null);
      setRouteName("");
      alert("Tiedosto ladattu!");
    } catch (err) {
      console.error(err);
      alert("Tiedoston lähetys epäonnistui");
    } finally {
      setIsUploading(false);
    }
  };

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
          {testObject.map((route, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-between bg-icy-mint/50 rounded-lg px-4 py-3 border border-gray-300"
            >
              <p className="text-dark-navy-purple font-semibold">
                {route.name}
              </p>
              <button
                type="button"
                className="px-4 py-2 rounded-lg shadow-md hover:bg-danger-text bg-danger-badge text-white cursor-pointer"
              >
                Poista reitti
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoutesUploader;
