import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import type { Blog } from "../../../services/types/blog.types";
import { formatDate } from "../../../utils/alert";

interface BlogViewModalProps {
  blog: Blog;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (blog: Blog) => void; 
}

const BlogViewModal: React.FC<BlogViewModalProps> = ({
  blog,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-200/50"
      >
        {/* Header*/}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Blog Preview
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close"
          >
            <FiX className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-10 py-8 space-y-10">
          <div className="space-y-4 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
              {blog.created_at && (
                <span>Published {formatDate(blog.created_at)}</span>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
              {blog.content}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-5 flex justify-end gap-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all cursor-pointer"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default BlogViewModal;
