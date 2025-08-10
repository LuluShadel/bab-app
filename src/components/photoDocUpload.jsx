import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStepData } from "../store/wizardSlice";

import { ReactComponent as Delete } from "../svg/Delete.svg";

export default function PhotoUpload({
  step,
  field,
  title = "Ajouter un fichier",
  Icon = null,
  accept = "image/jpeg, image/jpg, image/png", // Peut être ".pdf", etc.
  value,
  onChange,
  removable = true,
}) {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  // Redux fallback si value non fourni
  const reduxFile = useSelector((state) =>
    step && field ? state.wizard[step]?.[field] : null
  );
  const file = value ?? reduxFile;

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && file.type?.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFile = (file) => {
    if (!file) return;

    if (onChange) {
      onChange(file); // mode contrôlé
    } else if (step && field) {
      dispatch(setStepData({ step, data: { [field]: file } }));
    }
  };

  const handleRemove = () => {
    if (onChange) {
      onChange(null);
    } else if (step && field) {
      dispatch(setStepData({ step, data: { [field]: null } }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="space-y-2">
      {title && <p className="text-sm font-bold">{title}</p>}

      <div
        className="relative border border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer bg-white hover:bg-gray-50 transition h-[231px]  flex justify-center items-center"
        onClick={() => fileInputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="relative w-full h-[231px]">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Aperçu"
                className="w-full h-[231px] object-cover rounded-lg"
              />
            ) : (
              <p className="text-sm">{file.name}</p>
            )}

            {removable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-1 right-1 rounded-full p-1 bg-primaryYellow text-white"
                title="Supprimer"
              >
                <Delete />
              </button>
            )}
          </div>
        ) : (
          <div>
            {Icon && <Icon className="mx-auto w-8 h-8 text-gray-500 mb-2" />}
            <p className="font-semibold">
              Glissez et déposez ici ou <span className="underline">importez</span> un fichier
            </p>
            <p className="text-sm text-gray-500 mt-1">Formats acceptés : {accept}</p>
          </div>
        )}

        <input
          type="file"
          accept={accept}
          className="hidden"
          ref={fileInputRef}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
