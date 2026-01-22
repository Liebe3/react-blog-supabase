import { supabase } from "../services/supabase";

// Upload single image per comment
export const uploadCommentImage = async (
  commentId: string,
  imageFile: File,
): Promise<string> => {
  try {
    // First, get the blog_id from the comment
    const { data: commentData, error: commentError } = await supabase
      .from("blog_comments")
      .select("blog_id")
      .eq("id", commentId)
      .single();

    if (commentError) throw commentError;

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${commentId}/${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("comment_images")
      .upload(fileName, imageFile, {
        contentType: imageFile.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("comment_images").getPublicUrl(uploadData.path);

    // Insert with blog_id
    const { error: databaseError } = await supabase
      .from("comment_images")
      .insert({
        comment_id: commentId,
        image_url: publicUrl,
        blog_id: commentData.blog_id, // Add this
      });

    if (databaseError) {
      console.error("Database insert error:", databaseError);
      await supabase.storage.from("comment_images").remove([uploadData.path]);
      throw databaseError;
    }

    return publicUrl;
  } catch (error) {
    console.error("Error uploading comment image:", error);
    throw error;
  }
};

// Delete comment image from storage and database
export const deleteCommentImage = async (commentId: string): Promise<void> => {
  try {
    // Get the image for this comment
    const { data: image, error: fetchError } = await supabase
      .from("comment_images")
      .select("image_url")
      .eq("comment_id", commentId)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned, which is fine
      throw fetchError;
    }

    if (image) {
      // Extract file path from URL
      const url = new URL(image.image_url);
      const pathParts = url.pathname.split("comment_images/");
      const filePath = pathParts[1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("comment_images")
        .remove([filePath]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from("comment_images")
      .delete()
      .eq("comment_id", commentId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error("Error deleting comment image:", error);
    throw error;
  }
};

export const deleteCommentAndImages = async (commentId: string) => {
  // Get all replies of this comment
  const { data: replies } = await supabase
    .from("blog_comments")
    .select("id")
    .eq("parent_comment_id", commentId);

  // Recursively delete images of replies
  if (replies?.length) {
    for (const reply of replies) {
      await deleteCommentAndImages(reply.id);
    }
  }

  // Delete this comment's image
  await deleteCommentImage(commentId);
};
