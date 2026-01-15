import { useEffect, useRef, useState } from "react";
import type { Blog } from "../../../services/types/blog.types";
import BlogCard from "./BlogCard";
import Modal from "../components/BlogModal";

interface BlogListProps {
  blogs: Blog[];
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, loadMore, isLoadingMore, hasMore }) => {
  const observerTarget = useRef<HTMLDivElement>(null);

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const openModal = (blog: Blog) => setSelectedBlog(blog);
  const closeModal = () => setSelectedBlog(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <>
      <div className="space-y-6">
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} onReadMore={openModal} />
        ))}
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedBlog} onClose={closeModal} title={selectedBlog?.title}>
        <p>{selectedBlog?.content}</p>
      </Modal>

      {/* Loading */}
      <div ref={observerTarget} className="py-8">
        {isLoadingMore && (
          <div className="flex justify-center items-center gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
        {!hasMore && blogs.length > 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">You’re All Caught Up</p>
        )}
      </div>
    </>
  );
};

export default BlogList;
