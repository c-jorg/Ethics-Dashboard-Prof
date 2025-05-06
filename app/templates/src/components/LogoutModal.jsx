import React from "react";
import { LogOut, X } from "lucide-react";

const LogoutModal = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        {/* Modal Content */}
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          {/* Logout Icon */}
          <div className="mb-6 flex justify-center">
            <LogOut size={32} className="text-blue-500" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Confirm Logout
          </h2>

          <p className="text-gray-600 mb-8">
            Are you sure you want to log out of your Ethics Dashboard account?
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={onLogout}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
            >
              Yes, Logout
            </button>
            <button
              onClick={onClose}
              className="border border-blue-500 text-blue-500 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;