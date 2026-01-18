import { motion } from "framer-motion";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { BlogWithImages } from "../../../services/types/blogimages.types";
import { formatDate } from "../../../utils/alert";
import ImagesCount from "./ImagesCount";

interface BlogCardProps {
  blog: BlogWithImages;
  index: number;
  onReadMore: (blog: BlogWithImages) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, index, onReadMore }) => {
  const truncateContent = (content: string, maxLength = 200) =>
    content.length <= maxLength
      ? content
      : content.substring(0, maxLength) + "...";

  const navigate = useNavigate();

  // Set a default empty array so TypeScript knows it exists
  const images = blog.images ?? [];

  // Display max 3 images
  const displayedImages = images.slice(0, 3);
  const remainingCount = images.length - displayedImages.length;

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

        {/* Images Gallery */}
        {displayedImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {displayedImages.map((image, i) => (
              <div
                key={image.id}
                className="relative overflow-hidden rounded-lg h-36"
              >
                <img
                  src={image.image_url}
                  alt={`${blog.title} image ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* +N overlay on the last image */}
                {i === displayedImages.length - 1 && remainingCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg rounded-lg">
                    +{remainingCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Content Preview */}
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-4">
          {truncateContent(blog.content)}
        </p>

        {/* Image Count Badge */}
        <ImagesCount images={blog.images ?? []} />

        {/* Read More */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onReadMore(blog);
          }}
          className="text-emerald-600 mt-3 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1 group cursor-pointer"
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
