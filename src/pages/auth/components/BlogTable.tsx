import { motion } from "framer-motion";
import {
  FiEdit3,
  FiEye,
  FiFileText,
  FiFilter,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

import { formatDate } from "../../../utils/alert";

import type { BlogWithImages } from "../../../services/types/blogimages.types";

interface BlogTableProps {
  blogs: BlogWithImages[];
  onEdit: (blog: BlogWithImages) => void;
  onDelete: (id: string) => void;
  onView: (blog: BlogWithImages) => void;
  handleOpenCreate: () => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  loading?: boolean;

  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  setCurrentPage: (page: number) => void;
}

const BlogTable: React.FC<BlogTableProps> = ({
  blogs = [],
  onEdit,
  onDelete,
  onView,
  handleOpenCreate,
  hasActiveFilters,
  clearFilters,
  loading = false,

  currentPage,
  totalPages,
  totalBlogs,
  setCurrentPage,
}) => {
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (blogs.length === 0 && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          {hasActiveFilters ? (
            <FiFilter className="w-8 h-8 text-gray-400" />
          ) : (
            <FiFileText className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {hasActiveFilters ? (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No blogs match your search
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              Try adjusting your search query
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Clear Search
            </motion.button>
          </>
        ) : (
          <>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">
              No blogs available.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCreate}
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Your First Blog
            </motion.button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenCreate}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 cursor-pointer"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Create New Blog
          </motion.button>
        </div>

        {/* Blogs Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/4 min-w-[200px]">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-2/5">
                  Content
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/6 min-w-[120px]">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/6 min-w-[120px]">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 w-[140px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, index) => {
                return (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 dark:text-white wrap-break-words">
                        {blog.title}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600 dark:text-gray-400 text-sm wrap-break-words line-clamp-2">
                        {truncateText(blog.content, 200)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600 dark:text-gray-400 text-sm wrap-break-words line-clamp-2">
                        {blog.images && blog.images.length > 0 ? (
                          <img
                            src={blog.images[0].image_url}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm">
                            No image
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
                        {formatDate(blog.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 flex-nowrap">
                        <motion.button
                          onClick={() => onView(blog)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer shrink-0"
                          title="View Blog"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          onClick={() => onEdit(blog)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer flex-shrink-0"
                          title="Edit Blog"
                        >
                          <FiEdit3 className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(blog.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer flex-shrink-0"
                          title="Delete Blog"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages} — {totalBlogs} total blogs
            </div>

            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(1, currentPage - 2);
                return startPage + i;
              })
                .filter((page) => page <= totalPages)
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm cursor-pointer ${
                      currentPage === page
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? "bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-pointer"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BlogTable;
