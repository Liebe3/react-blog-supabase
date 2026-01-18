import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import type { BlogImage } from "../../../services/types/blogimages.types";

interface ImageLightboxProps {
  images: BlogImage[];
  index: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  index,
  onClose,
  onNext,
  onPrev,
}) => {
  if (index === null) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
      >
        <FiX className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <FiChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
          >
            <FiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      <div className="max-w-5xl max-h-[90vh] flex items-center justify-center">
        <img
          src={images[index].image_url}
          alt={`Image ${index + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
        {index + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;
