import { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";

const RoutesUploader = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
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

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file); // backendin kentän nimi

      const res = await fetch("/api/routes/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setFile(null);
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
      <div className="w-full flex">
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

          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="ml-auto px-4 cursor-pointer py-2 rounded-lg shadow-md hover:bg-dark-navy-purple bg-icy-blue disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <p>{isUploading ? "Tallennetaan..." : "Tallenna"}</p>
          </button>
        </div>
      </div>
      <div className="pt-2">
        <p className="text-lg font-medium text-dark-navy-purple">
          Ladatut kellareitit
        </p>
      </div>
    </div>
  );
};

export default RoutesUploader;
