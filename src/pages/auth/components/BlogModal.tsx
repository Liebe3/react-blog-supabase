import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
        )}

        <div className="border-t border-gray-200 mb-5" />

        {/* Content */}
        <div className="text-gray-700 dark:text-gray-300 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        <div className="border-t border-gray-200 mt-5" />

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300dark:bg-gray-700 dark:text-whitedark:hover:bg-gray-600 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
