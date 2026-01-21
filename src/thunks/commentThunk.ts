import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";
import type {
  CommentWithImage,
  CreateCommentInput,
  UpdateCommentInput,
} from "../services/types/comment.type";

import type { RootState } from "../store";
import {
  deleteCommentAndImages,
  deleteCommentImage,
  uploadCommentImage,
} from "../utils/commentImageUpload";

//fetch all comments thunk
export const fetchBlogCommentsThunk = createAsyncThunk<
  CommentWithImage[],
  string, // blog_id
  { rejectValue: string }
>("comment/fetchBlogComments", async (blogId: string, { rejectWithValue }) => {
  try {
    // Fetch all comments for the blog
    const { data: commentsData, error: commentsError } = await supabase
      .from("blog_comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: true });

    if (commentsError) return rejectWithValue(commentsError.message);
    if (!commentsData) return [];

    // Get unique user IDs
    const userIds = [
      ...new Set(commentsData.map((comment) => comment.user_id)),
    ];

    // Fetch user profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", userIds);

    if (profilesError) {
      console.warn("Failed to fetch profiles:", profilesError.message);
    }

    // Fetch all comment images
    const commentIds = commentsData.map((comment) => comment.id);
    const { data: imagesData, error: imagesError } = await supabase
      .from("comment_images")
      .select("*")
      .in("comment_id", commentIds);

    if (imagesError) {
      console.warn("Failed to fetch comment images:", imagesError.message);
    }

    // Create maps
    const profilesMap = new Map(
      profilesData?.map((profile) => [profile.id, profile]) || [],
    );

    const imagesMap = new Map(
      imagesData?.map((image) => [image.comment_id, image]) || [],
    );

    // Organize comments with hierarchy
    const commentsMap = new Map<string, CommentWithImage>();
    const topLevelComments: CommentWithImage[] = [];

    // First pass: create all comment objects
    commentsData.forEach((comment) => {
      const commentWithDetails: CommentWithImage = {
        ...comment,
        author: profilesMap.get(comment.user_id),
        image: imagesMap.get(comment.id),
        replies: [],
      };
      commentsMap.set(comment.id, commentWithDetails);
    });

    // Second pass: organize hierarchy
    commentsData.forEach((comment) => {
      const commentWithDetails = commentsMap.get(comment.id)!;

      if (comment.parent_comment_id) {
        // This is a reply
        const parentComment = commentsMap.get(comment.parent_comment_id);
        if (parentComment) {
          parentComment.replies!.push(commentWithDetails);
        }
      } else {
        // This is a top-level comment
        topLevelComments.push(commentWithDetails);
      }
    });

    return topLevelComments;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Create comment thunk
export const createCommentThunk = createAsyncThunk<
  CommentWithImage,
  CreateCommentInput,
  { rejectValue: string; state: RootState }
>(
  "comment/createComment",
  async (input: CreateCommentInput, { rejectWithValue, dispatch }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return rejectWithValue("Not authenticated");
      }

      const { blog_id, content, parent_comment_id, image } = input;

      // Validate: at least content or image must be provided
      if (!content && !image) {
        return rejectWithValue("Comment must have either content or an image");
      }

      // Create comment
      const { data, error } = await supabase
        .from("blog_comments")
        .insert([
          {
            blog_id,
            user_id: user.id,
            content,
            parent_comment_id: parent_comment_id || null,
          },
        ])
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Upload image if provided
      let imageUrl: string | undefined;
      if (image) {
        try {
          imageUrl = await uploadCommentImage(data.id, image);
        } catch (imageError) {
          console.error("Failed to upload image:", imageError);
          // Continue even if image upload fails
        }
      }

      // Fetch author profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.warn("Failed to fetch profile:", profileError.message);
      }

      // Fetch the image data if uploaded
      let imageData;
      if (imageUrl) {
        const { data: imgData } = await supabase
          .from("comment_images")
          .select("*")
          .eq("comment_id", data.id)
          .single();
        imageData = imgData;
      }

      // Refresh comments for the blog
      dispatch(fetchBlogCommentsThunk(blog_id));

      return {
        ...data,
        author: profileData || undefined,
        image: imageData || undefined,
        replies: [],
      } as CommentWithImage;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// Update comment thunk
export const updateCommentThunk = createAsyncThunk<
  CommentWithImage,
  UpdateCommentInput,
  { rejectValue: string; state: RootState }
>(
  "comment/updateComment",
  async (input: UpdateCommentInput, { rejectWithValue, dispatch }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return rejectWithValue("Not authenticated");
      }

      const { id, content, image, removeImage } = input;

      // Validate: at least content or image must remain
      if (!content && !image && removeImage) {
        return rejectWithValue("Comment must have either content or an image");
      }

      // First, get the comment to verify ownership and get blog_id
      const { data: existingComment, error: fetchError } = await supabase
        .from("blog_comments")
        .select("blog_id, user_id")
        .eq("id", id)
        .single();

      if (fetchError) return rejectWithValue(fetchError.message);
      if (!existingComment) return rejectWithValue("Comment not found");

      // Verify the user owns this comment
      if (existingComment.user_id !== user.id) {
        return rejectWithValue("Not authorized to update this comment");
      }

      // Update comment content
      const { data, error } = await supabase
        .from("blog_comments")
        .update({ content })
        .eq("id", id)
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Handle image operations
      if (removeImage) {
        // Remove existing image
        try {
          await deleteCommentImage(id);
        } catch (imageError) {
          console.error("Failed to delete image:", imageError);
        }
      }

      if (image) {
        // Upload new image (this will replace existing one if any)
        try {
          await deleteCommentImage(id); // Remove old image first
          await uploadCommentImage(id, image);
        } catch (imageError) {
          console.error("Failed to upload new image:", imageError);
        }
      }

      // Fetch the complete comment with image and author
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("id", user.id)
        .single();

      const { data: imageData } = await supabase
        .from("comment_images")
        .select("*")
        .eq("comment_id", id)
        .single();

      // Refresh comments for the blog
      dispatch(fetchBlogCommentsThunk(existingComment.blog_id));

      return {
        ...data,
        author: profileData || undefined,
        image: imageData || undefined,
        replies: [],
      } as CommentWithImage;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// Delete comment thunk
export const deleteCommentThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>("comment/deleteComment", async (commentId, { rejectWithValue, dispatch }) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return rejectWithValue("Not authenticated");

    const { data: commentData, error: fetchError } = await supabase
      .from("blog_comments")
      .select("blog_id, user_id")
      .eq("id", commentId)
      .single();

    if (fetchError) return rejectWithValue(fetchError.message);
    if (!commentData) return rejectWithValue("Comment not found");
    if (commentData.user_id !== user.id)
      return rejectWithValue("Not authorized");

    // comment that has replied cant delete
    const { data: replies, error: repliesError } = await supabase
      .from("blog_comments")
      .select("id")
      .eq("parent_comment_id", commentId)
      .limit(1);

    if (repliesError) return rejectWithValue(repliesError.message);

    if (replies && replies.length > 0) {
      return rejectWithValue("Cannot delete a comment that has replies");
    }

    // Delete all images recursively
    await deleteCommentAndImages(commentId);

    // Delete parent comment (cascade deletes replies in DB)
    const { error: deleteError } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", commentId);

    if (deleteError) return rejectWithValue(deleteError.message);

    dispatch(fetchBlogCommentsThunk(commentData.blog_id));

    return commentId;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});
