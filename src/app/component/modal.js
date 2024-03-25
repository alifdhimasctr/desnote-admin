import React from "react";
import { IoCloseSharp } from "react-icons/io5";

const Modal = ({ isVisible, onClose , children}) => {
  if (!isVisible) return null;
  const handleClose = (e) => {
    if (e.target.id === 'wrapper' ) onClose();
    
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="flex flex-col bg-gray-100 w-3/4 max-h-[30rem] overflow-auto p-4 rounded-lg shadow-lg">
        <button className="self-end mb-4" onClick={() => onClose()}><IoCloseSharp /></button>
        <div className="flex flex-col gap-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

