import React, { useEffect, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type {
  CommentWithImage,
  CreateCommentInput,
  UpdateCommentInput,
} from "../../../services/types/comment.type";
import type { AppDispatch, RootState } from "../../../store";
import {
  createCommentThunk,
  updateCommentThunk,
} from "../../../thunks/commentThunk";
import { ShowError, ShowSucess } from "../../../utils/alert";

interface CommentFormProps {
  blogId: string;
  parentCommentId?: string | null;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
  isReply?: boolean;
  editingComment?: CommentWithImage | null;
}

const CommentForm: React.FC<CommentFormProps> = ({
  blogId,
  parentCommentId,
  onSubmitSuccess,
  onCancel,
  isReply = false,
  editingComment = null,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.comment);

  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Initialize form with editing comment data
  useEffect(() => {
    if (editingComment) {
      setContent(editingComment.content || "");
      if (editingComment.image) {
        setPreviewUrl(editingComment.image.image_url);
      }
    } else {
      setContent("");
      setSelectedImage(null);
      setPreviewUrl("");
    }
  }, [editingComment]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      ShowError("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    // Validate file size 5MB
    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      ShowError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // redirect to login if not login
    if (!user) {
      navigate("/auth/login");
      return;
    }

    // error if space only
    if (!content.trim() && !selectedImage) {
      ShowError("Please enter a comment or upload an image");
      return;
    }

    try {
      if (editingComment) {
        // Update existing comment
        const updateData: UpdateCommentInput = {
          id: editingComment.id,
          content: content.trim() || null,
          image: selectedImage || undefined,
          removeImage: !!previewUrl && !selectedImage,
        };

        await dispatch(updateCommentThunk(updateData)).unwrap();
        ShowSucess("Comment updated successfully");
      } else {
        // Create new comment
        const commentData: CreateCommentInput = {
          blog_id: blogId,
          content: content.trim() || null,
          parent_comment_id: parentCommentId || null,
          image: selectedImage || undefined,
        };

        await dispatch(createCommentThunk(commentData)).unwrap();
        ShowSucess("Comment posted successfully");
      }

      setContent("");
      setSelectedImage(null);
      setPreviewUrl("");
      onSubmitSuccess?.();
    } catch (error) {
      ShowError((error as string) || "Failed to save comment");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${
        isReply ? "bg-gray-50 dark:bg-gray-900 p-4 rounded-lg" : "space-y-4"
      }`}
    >
      {/* Author Info */}
      {!isReply && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-semibold">
            {user?.profile?.first_name?.[0] ||
              user?.profile?.last_name?.[0] ||
              "U"}
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.profile?.first_name && user?.profile?.last_name
              ? `${user.profile.first_name} ${user.profile.last_name}`
              : user?.email || "Anonymous"}
          </p>
        </div>
      )}

      {/* Comment Input */}
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isReply
              ? "Write a reply..."
              : "Share your thoughts about this post..."
          }
          rows={isReply ? 3 : 4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative w-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition cursor-pointer"
            aria-label="Remove image"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            disabled={loading}
          />
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition text-sm font-medium">
            <FiImage className="w-4 h-4" />
            <span>Add Image</span>
          </div>
        </label>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium transition text-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white rounded-lg font-medium transition cursor-pointer text-sm"
          >
            {loading
              ? "Saving..."
              : editingComment
                ? "Update Comment"
                : "Post Comment"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CommentForm;
