import type { BlogImage } from "../../../services/types/blogimages.types";

interface ImagesCountProps {
  images: BlogImage[];
}

const ImagesCount: React.FC<ImagesCountProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-3 py-1 rounded-full">
        {images.length} {images.length === 1 ? "image" : "images"}
      </span>
    </div>
  );
};

export default ImagesCount;
