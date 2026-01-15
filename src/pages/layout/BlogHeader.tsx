import { motion } from "framer-motion";

const BlogHeader = () => {
  return (
    <motion.div
      className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    ></motion.div>
  );
};

export default BlogHeader;
