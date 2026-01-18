import { useEffect, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import type {
  BlogImage,
  BlogWithImages,
} from "../../../services/types/blogimages.types";
import { useAppSelector } from "../../../store/hooks";
import { ShowError } from "../../../utils/alert";

const initialForm = {
  title: "",
  content: "",
};

const formModes = {
  Create: "create",
  Update: "update",
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 15;

interface BlogFormProps {
  mode?: string;
  selectedBlog?: BlogWithImages | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  mode = formModes.Create,
  selectedBlog,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<BlogImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const { loading } = useAppSelector((state) => state.blog);

  useEffect(() => {
    if (mode === formModes.Update && selectedBlog) {
      setForm({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
      });

      // Set existing images from the blog
      if (selectedBlog.images && selectedBlog.images.length > 0) {
        setExistingImages(selectedBlog.images);
      } else {
        setExistingImages([]);
      }

      // Reset new images and previews
      setImageFiles([]);
      setPreviewUrls([]);
      setRemovedImageIds([]);
    } else {
      setForm(initialForm);
      setImageFiles([]);
      setPreviewUrls([]);
      setExistingImages([]);
      setRemovedImageIds([]);
    }
  }, [mode, selectedBlog]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleImageSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Validate all files before adding
      for (const file of newFiles) {
        // Check size limit first (15MB)
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          ShowError(
            `File size exceeds ${MAX_SIZE_MB}MB limit. ${file.name} is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`,
          );
          return;
        }

        // Block invalid file types
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
          ShowError(
            `Invalid file type: ${file.name}. Only JPG, PNG, and WEBP images are allowed.`,
          );
          return;
        }
      }

      // All files are valid, add them
      setImageFiles((prev) => [...prev, ...newFiles]);

      // Create preview URLs for new files
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrls((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: string) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const submitData = {
      ...form,
      images: imageFiles.length > 0 ? imageFiles : undefined,
      removedImageIds: removedImageIds.length > 0 ? removedImageIds : undefined,
    };

    if (mode === formModes.Update && selectedBlog) {
      onSubmit({ ...submitData, id: selectedBlog.id });
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blog Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Blog Title
          </label>
          <input
            value={form.title}
            type="text"
            name="title"
            placeholder="Enter blog title..."
            required
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Blog Content */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            value={form.content}
            name="content"
            rows={8}
            placeholder="Write your blog content here..."
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Images (Optional)
          </label>

          {/* Existing Images - Only show in Update mode */}
          {mode === formModes.Update && existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Current images
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {existingImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.image_url}
                      alt="Existing"
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="mt-1">
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
              <FiUpload className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {mode === formModes.Update
                  ? "Add more images"
                  : "Click to upload images"}
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSubmit}
                className="hidden"
              />
            </label>
          </div>

          {/* New Image Previews */}
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                New images to upload
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove image"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-xl font-medium shadow-lg transition duration-200 
              ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed hover:bg-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              } 
              text-white`}
            disabled={loading}
          >
            {loading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
                ? "Create Blog"
                : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
