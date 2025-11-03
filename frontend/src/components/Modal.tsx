import type { ReactNode } from 'react'; // Import the 'ReactNode' type

// --- Icons ---
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// --- Component Props ---
// Declaring what props (information) this component needs
type ModalProps = {
  isOpen: boolean;           // Is the modal open? (true/false)
  onClose: () => void;       // Function to call when closing the modal
  title: string;             // Title of the modal (e.g., "Add New Item")
  children: ReactNode;       // What should appear inside the modal body (e.g., a form)
};

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // If isOpen is false, don’t render anything
  if (!isOpen) {
    return null;
  }

  // --- JSX ---
  return (
    // 'fixed' - makes the modal float over the entire screen
    // 'z-50' - ensures it appears above almost everything else
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* 1. Backdrop / Overlay (the dark blurred background) */}
      <div 
        className="fixed inset-0 backdrop-blur-2xl bg-opacity-60 backdrop-blur-sm"
        onClick={onClose} // Clicking the overlay should also close the modal
      ></div>

      {/* 2. Modal Content (the white box) */}
      {/* 'relative' - ensures it’s positioned above the overlay */}
      {/* 'z-10' - sits above the overlay but within the z-50 scope */}
      <div className="relative z-10 w-full max-w-lg p-6 bg-white rounded-xl shadow-xl">
        
        {/* Modal Header (title + close button) */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose} // Closes the modal when the "X" is clicked
            className="p-2 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-100"
            title="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Body (this is where our form or children will sit) */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;