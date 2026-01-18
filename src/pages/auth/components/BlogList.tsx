import { useEffect, useRef, useState } from "react";
import type { BlogWithImages } from "../../../services/types/blogimages.types";
import { useLightbox } from "../../../store/useLightbox";
import BlogCard from "./BlogCard";
import Modal from "./BlogModal";
import ImageGallery from "./ImageGallery";
import ImageLightbox from "./ImageLightbox";
import ImagesCount from "./ImagesCount";

interface BlogListProps {
  blogs: BlogWithImages[];
  loadMore: () => void;
  isLoadingMore: boolean;
  hasMore: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  loadMore,
  isLoadingMore,
  hasMore,
}) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogWithImages | null>(null);

  const images = selectedBlog?.images ?? [];
  const lightbox = useLightbox(images.length);

  const openModal = (blog: BlogWithImages) => setSelectedBlog(blog);
  const closeModal = () => {
    setSelectedBlog(null);
    lightbox.close();
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 },
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
          <BlogCard
            key={blog.id}
            blog={blog}
            index={index}
            onReadMore={openModal}
          />
        ))}
      </div>

      {/* Blog Details Modal */}
      {selectedBlog && (
        <Modal
          isOpen={!!selectedBlog}
          onClose={closeModal}
          title={selectedBlog.title}
        >
          <div className="space-y-6">
            {/* Images Gallery */}
            {images.length > 0 && (
              <ImageGallery
                images={images}
                blogTitle={selectedBlog.title}
                onImageClick={lightbox.open}
              />
            )}

            {/* Blog Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {selectedBlog.content}
              </p>
            </div>

            {/* Image Count Badge */}
            <ImagesCount images={images} />
          </div>
        </Modal>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        images={images}
        index={lightbox.index}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
      />

      {/* Infinite Scroll Loading Indicator */}
      <div ref={observerTarget} className="py-8">
        {isLoadingMore && (
          <div className="flex justify-center items-center gap-2">
            <div
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        )}
        {!hasMore && blogs.length > 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
            You're All Caught Up
          </p>
        )}
      </div>
    </>
  );
};

export default BlogList;
