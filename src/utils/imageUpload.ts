import { supabase } from "../services/supabase";

//Upload images to Supabase storage
// create blog_images records
export const uploadBlogImages = async (
  blogId: string,
  imageFiles: File[],
): Promise<string[]> => {
  const uploadedUrls: string[] = [];

  for (const file of imageFiles) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${blogId}/${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-images") // bucket name
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(uploadData.path);

      // Insert into blog_images table
      const { error: databaseError } = await supabase.from("blog_images").insert({
        blog_id: blogId,
        image_url: publicUrl,
      });

      if (databaseError) {
        console.error("Database insert error:", databaseError);
        // delete uploaded file if database insert fails
        await supabase.storage.from("blog-images").remove([uploadData.path]);
        throw databaseError;
      }

      uploadedUrls.push(publicUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  return uploadedUrls;
};

export const updateBlogImages = async (imageIds: string[]) => {
  if (imageIds.length === 0) return;

  // Get image URLs before deleting from database
  const { data: images } = await supabase
    .from("blog_images")
    .select("image_url")
    .in("id", imageIds);

  if (images && images.length > 0) {
    // Extract file paths from URLs and delete from storage
    const filePaths = images
      .map((img) => {
        const url = img.image_url;
        const match = url.match(/blog-images\/(.+)$/);
        return match ? match[1] : null;
      })
      .filter(Boolean) as string[];

    if (filePaths.length > 0) {
      await supabase.storage.from("blog-images").remove(filePaths);
    }
  }

  // Delete records from database
  await supabase.from("blog_images").delete().in("id", imageIds);
};

// Delete blog images from storage and database
export const deleteBlogImages = async (blogId: string): Promise<void> => {
  try {
    // Get all images for this blog
    const { data: images, error: fetchError } = await supabase
      .from("blog_images")
      .select("image_url")
      .eq("blog_id", blogId);

    if (fetchError) throw fetchError;

    if (images && images.length > 0) {
      // Extract file paths from URLs
      const filePaths = images.map((img) => {
        const url = new URL(img.image_url);
        // Extract path after 'blog-images/'
        const pathParts = url.pathname.split("blog-images/");
        return pathParts[1];
      });

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("blog-images")
        .remove(filePaths);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
      }
    }

    // Delete from database (cascade should handle this but just in case)
    const { error: dbError } = await supabase
      .from("blog_images")
      .delete()
      .eq("blog_id", blogId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error("Error deleting blog images:", error);
    throw error;
  }
};
