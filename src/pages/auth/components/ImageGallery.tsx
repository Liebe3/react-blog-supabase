import type { BlogImage } from "../../../services/types/blogimages.types";

interface ImageGalleryProps {
  images: BlogImage[];
  blogTitle: string;
  onImageClick: (index: number) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  blogTitle,
  onImageClick,
}) => {
  if (images.length === 0) return null;

  const displayedImages = images.slice(0, 3);
  const remainingCount = images.length - displayedImages.length;

  return (
    <div className="m-3">
      <div className="grid grid-cols-3 gap-2 px-4 py-0">
        {displayedImages.map((image, i) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-lg h-36 bg-gray-200 dark:bg-gray-700 cursor-pointer group"
            onClick={() => onImageClick(i)}
          >
            <img
              src={image.image_url}
              alt={`${blogTitle} image ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
						
            {/* +N overlay on the last image */}
            {i === displayedImages.length - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg rounded-lg group-hover:bg-black/60 transition-colors">
                +{remainingCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
