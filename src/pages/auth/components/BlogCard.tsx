import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Blog } from "../../../services/types/blog.types";
import { formatDate } from "../../../utils/alert";

interface BlogCardProps {
  blog: Blog;
  index: number;
  onReadMore: (blog: Blog) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, index, onReadMore }) => {
  const truncateContent = (content: string, maxLength = 200) =>
    content.length <= maxLength
      ? content
      : content.substring(0, maxLength) + "...";

  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={() => navigate(`/blogs/${blog.id}`)}
    >
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold">
            {blog.author?.first_name?.[0] || blog.author?.last_name?.[0] || "A"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {blog.author?.first_name && blog.author?.last_name
                ? `${blog.author.first_name} ${blog.author.last_name}`
                : "Anonymous"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-3.5 h-3.5" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          {blog.title}
        </h2>

        {/* Content Preview */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {truncateContent(blog.content)}
        </p>

        {/* Read More */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onReadMore(blog);
          }}
          className="text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 group cursor-pointer"
        >
          Read more
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </motion.article>
  );
};

export default BlogCard;
