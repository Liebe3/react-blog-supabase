import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import type { BlogWithImages } from "../../../services/types/blogimages.types";
import { useLightbox } from "../../../store/useLightbox";
import { formatDate } from "../../../utils/alert";
import ImageGallery from "./ImageGallery";
import ImageLightbox from "./ImageLightbox";
import ImagesCount from "./ImagesCount";

interface BlogViewModalProps {
  blog: BlogWithImages;
  isOpen: boolean;
  onClose: () => void;
}

const BlogViewModal: React.FC<BlogViewModalProps> = ({
  blog,
  isOpen,
  onClose,
}) => {
  const images = blog.images || [];
  const lightbox = useLightbox(images.length);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-5 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              Blog Preview
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-10 py-8 space-y-6">
            {/* Title */}
            <div className="space-y-4 text-center sm:text-left">
              {/* Author & Date */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold">
                  {blog.author?.first_name?.[0] ||
                    blog.author?.last_name?.[0] ||
                    "A"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {blog.author?.first_name && blog.author?.last_name
                      ? `${blog.author.first_name} ${blog.author.last_name}`
                      : "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(blog.created_at)}
                  </p>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {blog.title}
              </h1>
            </div>

            {/* Images Gallery */}
            {images.length > 0 && (
              <ImageGallery
                images={images}
                blogTitle={blog.title}
                onImageClick={lightbox.open}
              />
            )}

            {/* Blog Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base md:text-lg">
                {blog.content}
              </p>
            </div>

            {/* Image Count Badge */}
            <ImagesCount images={images} />
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-6 py-5 flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all cursor-pointer"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        index={lightbox.index}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
      />
    </>
  );
};

export default BlogViewModal;
