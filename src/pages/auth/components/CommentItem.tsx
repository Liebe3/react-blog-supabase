import React, { useState } from "react";
import { FiEdit2, FiMessageCircle, FiTrash2 } from "react-icons/fi";
import type { CommentWithImage } from "../../../services/types/comment.type";
import { formatDate } from "../../../utils/alert";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: CommentWithImage;
  blogId: string;
  onReplyPosted?: () => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (comment: CommentWithImage) => void;
  currentUserId?: string;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  blogId,
  onReplyPosted,
  onDelete,
  onEdit,
  currentUserId,
  isReply = false,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUserId === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Comment */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-semibold">
              {comment.author?.first_name?.[0] ||
                comment.author?.last_name?.[0] ||
                "A"}
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {comment.author?.first_name && comment.author?.last_name
                  ? `${comment.author.first_name} ${comment.author.last_name}`
                  : "Anonymous"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-emerald-500 transition cursor-pointer p-1"
                aria-label="Edit comment"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onDelete?.(comment.id);
                }}
                disabled={hasReplies} 
                className={`p-1 transition ${
                  hasReplies
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-400 hover:text-red-500 cursor-pointer"
                }`}
                aria-label="Delete comment"
                title={
                  hasReplies
                    ? "Cannot delete comment with replies"
                    : "Delete comment"
                }
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content or Edit Form */}
        {isEditing ? (
          <div className="mb-4">
            <CommentForm
              blogId={blogId}
              editingComment={comment}
              onSubmitSuccess={() => {
                setIsEditing(false);
                onEdit?.(comment);
              }}
              onCancel={() => setIsEditing(false)}
              isReply
            />
          </div>
        ) : (
          <div className="space-y-3">
            {comment.content && (
              <p className="whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {comment.content}
              </p>
            )}

            {/* Image */}
            {comment.image && (
              <img
                src={comment.image.image_url}
                alt="Comment image"
                className="max-w-sm h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
            )}
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* for reaction features */}
            {/* <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition cursor-pointer text-sm">
              <FiHeart className="w-4 h-4" />
              <span>0</span>
            </button> */}

            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-gray-500 hover:text-emerald-600 transition cursor-pointer text-sm"
            >
              <FiMessageCircle className="w-4 h-4" />
              <span>Reply</span>
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition cursor-pointer"
              >
                {showReplies
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div
          className={
            isReply
              ? ""
              : "ml-8 border-l-2 border-emerald-300 dark:border-emerald-700"
          }
        >
          <CommentForm
            blogId={blogId}
            parentCommentId={comment.id}
            onSubmitSuccess={() => {
              setShowReplyForm(false);
              setShowReplies(true);
              onReplyPosted?.();
            }}
            onCancel={() => setShowReplyForm(false)}
            isReply
          />
        </div>
      )}

      {/* Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div
          className={
            isReply
              ? "space-y-4"
              : "ml-8 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4"
          }
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              blogId={blogId}
              onReplyPosted={onReplyPosted}
              onDelete={onDelete}
              onEdit={onEdit}
              currentUserId={currentUserId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
