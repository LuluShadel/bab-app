import { useEffect, useState } from "react";

export default function ConfirmationModal({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // démarre l'animation juste après le montage
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-xl shadow-xl text-center max-w-sm w-full space-y-4 transform transition-all duration-300 ease-out
        ${show ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      >
        <h2 className="font-bold text-primaryBlue text-lg">{message}</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-100 text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-full bg-primaryYellow text-black font-medium hover:bg-yellow-500 text-sm"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
