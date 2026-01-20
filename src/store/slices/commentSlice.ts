import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import type {
  CommentState,
  CommentWithImage,
} from "../../services/types/comment.type";

import {
  createCommentThunk,
  deleteCommentThunk,
  fetchBlogCommentsThunk,
  updateCommentThunk,
} from "../../thunks/commentThunk";

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,

  reducers: {
    clearError(state) {
      state.error = null;
    },

    resetComments(state) {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },

    // Optimistic updates for real-time feel
    addCommentOptimistic(state, action: PayloadAction<CommentWithImage>) {
      const comment = action.payload;

      if (comment.parent_comment_id) {
        const addReplyToComment = (comments: CommentWithImage[]): boolean => {
          for (const c of comments) {
            if (c.id === comment.parent_comment_id) {
              c.replies = c.replies || [];
              c.replies.push(comment);
              return true;
            }
            if (c.replies && addReplyToComment(c.replies)) {
              return true;
            }
          }
          return false;
        };
        addReplyToComment(state.comments);
      } else {
        // Top-level comment
        state.comments.push(comment);
      }
    },

    updateCommentOptimistic(state, action: PayloadAction<CommentWithImage>) {
      const updated = action.payload;
      const updateInTree = (comments: CommentWithImage[]) => {
        for (let i = 0; i < comments.length; i++) {
          if (comments[i].id === updated.id) {
            comments[i] = { ...comments[i], ...updated };
            return true;
          }
          if (comments[i].replies && updateInTree(comments[i].replies!)) {
            return true;
          }
        }
        return false;
      };
      updateInTree(state.comments);
    },

    deleteCommentOptimistic(state, action: PayloadAction<string>) {
      const commentId = action.payload;
      const removeFromTree = (
        comments: CommentWithImage[],
      ): CommentWithImage[] => {
        return comments.filter((c) => {
          if (c.id === commentId) return false;
          if (c.replies) {
            c.replies = removeFromTree(c.replies);
          }
          return true;
        });
      };
      state.comments = removeFromTree(state.comments);
    },
  },

  extraReducers: (builder) => {
    // Fetch blog comments
    builder
      .addCase(fetchBlogCommentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBlogCommentsThunk.fulfilled,
        (state, action: PayloadAction<CommentWithImage[]>) => {
          state.comments = action.payload;
          state.loading = false;
        },
      )
      .addCase(fetchBlogCommentsThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch comments";
        state.loading = false;
      })

      // Create comment
      .addCase(createCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCommentThunk.fulfilled,
        (state, _action: PayloadAction<CommentWithImage>) => {
          state.loading = false;
        },
      )
      .addCase(createCommentThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to create comment";
        state.loading = false;
      })

      // Update comment
      .addCase(updateCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCommentThunk.fulfilled,
        (state, _action: PayloadAction<CommentWithImage>) => {
          state.loading = false;
        },
      )
      .addCase(updateCommentThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to update comment";
        state.loading = false;
      })

      // Delete comment
      .addCase(deleteCommentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCommentThunk.fulfilled,
        (state, _action: PayloadAction<string>) => {
          state.loading = false;
        },
      )
      .addCase(deleteCommentThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete comment";
        state.loading = false;
      });
  },
});

export const { clearError, resetComments } = commentSlice.actions;
export default commentSlice.reducer;
