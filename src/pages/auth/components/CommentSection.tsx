import React, { useEffect } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import {
  deleteCommentThunk,
  fetchBlogCommentsThunk,
} from "../../../thunks/commentThunk";
import { ConfirmDelete } from "../../../utils/alert";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import Loading from "./Loading";

interface CommentSectionProps {
  blogId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error } = useSelector(
    (state: RootState) => state.comment,
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchBlogCommentsThunk(blogId));
  }, [dispatch, blogId]);

  const handleDeleteComment = (commentId: string) => {
    ConfirmDelete(
      dispatch,
      deleteCommentThunk,
      commentId,
      "Comment deleted successfully",
    );
  };

  const handleEditComment = () => {
    dispatch(fetchBlogCommentsThunk(blogId));
  };

  const handleRefreshComments = () => {
    dispatch(fetchBlogCommentsThunk(blogId));
  };

  return (
    <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-8 ml-4">
        <FiMessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <CommentForm blogId={blogId} onSubmitSuccess={handleRefreshComments} />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {loading && comments.length === 0 ? (
          <Loading />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              blogId={blogId}
              onReplyPosted={handleRefreshComments}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              currentUserId={user?.id}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
