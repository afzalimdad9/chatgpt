import React, { useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  children: React.ReactNode;
  onClose?: () => void;
}

const WelcomeBack = ({ children }: ModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return isModalOpen
    ? ReactDOM.createPortal(
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div
            className="bg-gray-900 rounded-lg shadow-lg p-4 flex justify-center items-center flex-col text-center w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition duration-300 ease-in-out absolute top-4 right-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {children}
          </div>
        </div>,
        document.body
      )
    : null;
};

export default WelcomeBack;

