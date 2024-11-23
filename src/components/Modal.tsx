import React, { useState } from "react";

interface ModalProps {
  date: string;
  onClose: () => void;
  onSave: (title: string) => void;
}

const Modal: React.FC<ModalProps> = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-2">Add Note for {date}</h2>
        <input type="text" className="border w-full p-2 rounded-lg mb-4" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter note title" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg"> Cancel </button>
          <button onClick={() => { onSave(title); setTitle(""); }} className="px-4 py-2 bg-blue-500 text-white rounded-lg" > Save </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
