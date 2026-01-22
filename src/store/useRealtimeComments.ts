import type { RealtimeChannel } from "@supabase/supabase-js";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { supabase } from "../services/supabase";
import type { AppDispatch } from "../store";
import { fetchBlogCommentsThunk } from "../thunks/commentThunk";

export const useRealtimeComments = (blogId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const refreshComments = useCallback(() => {
    dispatch(fetchBlogCommentsThunk(blogId));
  }, [dispatch, blogId]);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Create a channel
      channel = supabase
        .channel(`comment_images-and-blog-comments:${blogId}`)
        .on(
          "postgres_changes",
          {
            event: "*", 
            schema: "public",
            table: "blog_comments",
            filter: `blog_id=eq.${blogId}`,
          },
          () => {
            refreshComments();
          },
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "comment_images",
            filter: `blog_id=eq.${blogId}`,
          },
          () => {
            // Refresh to get updated images
            refreshComments();
          },
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [blogId, refreshComments]);

  return { refreshComments };
};
