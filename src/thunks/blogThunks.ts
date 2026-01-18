import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";
import type { RootState } from "../store";

import type {
  CreateBlogInput,
  UpdateBlogInput,
} from "../services/types/blog.types";

import type { BlogWithImages } from "../services/types/blogimages.types";
import { deleteBlogImages, updateBlogImages, uploadBlogImages } from "../utils/imageUpload";


interface FetchUserBlogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Fetch all blogs thunk
export const fetchBlogsThunk = createAsyncThunk<
  BlogWithImages[],
  void,
  { rejectValue: string }
>("blog/fetchBlogs", async (_, { rejectWithValue }) => {
  try {
    // First, fetch all blogs
    const { data: blogsData, error: blogsError } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (blogsError) return rejectWithValue(blogsError.message);
    if (!blogsData) return [];

    // Get unique author IDs
    const authorIds = [...new Set(blogsData.map((blog) => blog.author_id))];

    // Fetch author profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .in("id", authorIds);

    if (profilesError) {
      console.warn("Failed to fetch profiles:", profilesError.message);
    }

    // Fetch all blog images
    const blogIds = blogsData.map((blog) => blog.id);
    const { data: imagesData, error: imagesError } = await supabase
      .from("blog_images")
      .select("*")
      .in("blog_id", blogIds)
      .order("created_at", { ascending: true });

    if (imagesError) {
      console.warn("Failed to fetch blog images:", imagesError.message);
    }

    // Create a map of author_id to profile
    const profilesMap = new Map(
      profilesData?.map((profile) => [profile.id, profile]) || [],
    );

    // Create a map of blog_id to images
    const imagesMap = new Map<string, typeof imagesData>();
    imagesData?.forEach((image) => {
      if (!imagesMap.has(image.blog_id)) {
        imagesMap.set(image.blog_id, []);
      }
      imagesMap.get(image.blog_id)?.push(image);
    });

    // Combine blogs with author information and images
    const blogsWithAuthorsAndImages = blogsData.map((blog) => ({
      ...blog,
      author: profilesMap.get(blog.author_id) || undefined,
      images: imagesMap.get(blog.id) || [],
    }));

    return blogsWithAuthorsAndImages as BlogWithImages[];
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Fetch user blogs with pagination and search thunk
export const fetchUserBlogsThunk = createAsyncThunk<
  { blogs: BlogWithImages[]; total: number },
  FetchUserBlogsParams | undefined,
  { rejectValue: string; state: RootState }
>("blog/fetchUserBlogs", async (params, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const { currentPage, pageSize: defaultPageSize } = state.blog;

    // Use params if provided, otherwise use state values
    const page = params?.page ?? currentPage;
    const pageSize = params?.pageSize ?? defaultPageSize;
    const search = params?.search ?? "";

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return rejectWithValue("Not authenticated");

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // Build query
    let query = supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("author_id", user.id);

    if (search && search.trim() !== "") {
      query = query.ilike("title", `%${search.trim()}%`);
    }

    // Apply ordering and pagination
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(start, end);

    if (error) return rejectWithValue(error.message);
    if (!data) return { blogs: [], total: 0 };

    // Fetch author profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return rejectWithValue(profileError.message);
    }

    const blogIds = data.map((blog) => blog.id);
    const { data: imagesData, error: imagesError } = await supabase
      .from("blog_images")
      .select("*")
      .in("blog_id", blogIds)
      .order("created_at", { ascending: true });
    if (imagesError) {
      return rejectWithValue(imagesError.message);
    }

    const imagesMap = new Map<string, typeof imagesData>();
    imagesData?.forEach((image) => {
      if (!imagesMap.has(image.blog_id)) {
        imagesMap.set(image.blog_id, []);
      }
      imagesMap.get(image.blog_id)?.push(image);
    });

    //combine blogs with images and author
    const blogsWithImages = data.map((blog) => ({
      ...blog,
      author: profileData,
      images: imagesMap.get(blog.id) || [],
    }));

    return { blogs: blogsWithImages as BlogWithImages[], total: count || 0 };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Fetch blog by ID
export const fetchBlogByIdThunk = createAsyncThunk<
  BlogWithImages,
  string,
  { rejectValue: string }
>("blog/fetchBlogById", async (id: string, { rejectWithValue }) => {
  try {
    // for blog fetch
    const { data: blogData, error: blogError } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (blogError) return rejectWithValue(blogError.message);
    if (!blogData) return rejectWithValue("Blog not found");

    // for author fetch
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("id", blogData.author_id)
      .single();

    if (profileError) return rejectWithValue(profileError.message);

    //for images fetch
    const { data: imagesData, error: imagesError } = await supabase
      .from("blog_images")
      .select("*")
      .eq("blog_id", id)
      .order("created_at", { ascending: true });

    if (imagesError) return rejectWithValue(imagesError.message);

    return {
      ...blogData,
      author: profileData,
      images: imagesData || [],
    } as BlogWithImages;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Create Thunk with Image Upload
export const createBlogThunk = createAsyncThunk<
  BlogWithImages,
  CreateBlogInput,
  { rejectValue: string; state: RootState }
>(
  "blog/createBlog",
  async (input: CreateBlogInput, { rejectWithValue, dispatch, getState }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return rejectWithValue("Not authenticated");
      }

      // Extract images from input
      const { images, title, content } = input;

      // Create blog first
      const { data, error } = await supabase
        .from("blogs")
        .insert([{ title, content, author_id: user.id }])
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Upload images if provided
      if (images && images.length > 0) {
        try {
          await uploadBlogImages(data.id, images);
        } catch (imageError) {
          console.error("Failed to upload images:", imageError);
          // Continue even if image upload fails
        }
      }

      // Fetch the complete blog with images
      const { data: imagesData } = await supabase
        .from("blog_images")
        .select("*")
        .eq("blog_id", data.id)
        .order("created_at", { ascending: true });

      // Refresh blogs with current pagination state
      const state = getState();
      dispatch(
        fetchUserBlogsThunk({
          page: 1, // Go to first page after creating
          pageSize: state.blog.pageSize,
        }),
      );

      return {
        ...data,
        images: imagesData || [],
      } as BlogWithImages;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// Update Thunk with Image Upload
export const updateBlogThunk = createAsyncThunk<
  BlogWithImages,
  UpdateBlogInput,
  { rejectValue: string; state: RootState }
>("blog/updateBlog", async (input, { rejectWithValue, dispatch, getState }) => {
  try {
    const { images, id, title, content, removedImageIds } = input;

    // Update blog
    const { data, error } = await supabase
      .from("blogs")
      .update({ title, content })
      .eq("id", id)
      .select()
      .single();

    if (error) return rejectWithValue(error.message);

    // Delete specific images if any were removed
    if (removedImageIds && removedImageIds.length > 0) {
      try {
        await updateBlogImages(removedImageIds);
      } catch (imageError) {
        console.error("Failed to delete images:", imageError);
      }
    }

    // Upload new images if provided
    if (images && images.length > 0) {
      try {
        await uploadBlogImages(id, images);
      } catch (imageError) {
        console.error("Failed to upload new images:", imageError);
      }
    }

    // Fetch the complete blog with all remaining images
    const { data: imagesData } = await supabase
      .from("blog_images")
      .select("*")
      .eq("blog_id", id)
      .order("created_at", { ascending: true });

    // Refresh blogs with current pagination state
    const state = getState();
    dispatch(
      fetchUserBlogsThunk({
        page: state.blog.currentPage,
        pageSize: state.blog.pageSize,
      }),
    );

    return {
      ...data,
      images: imagesData || [],
    } as BlogWithImages;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Delete Thunk
export const deleteBlogThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>(
  "blog/deleteBlog",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      // Delete images from storage and database
      try {
        await deleteBlogImages(id);
      } catch (imageError) {
        console.error("Failed to delete images:", imageError);
        // Continue with blog deletion even if image deletion fails
      }

      // Delete blog (cascade will delete any remaining blog_images records)
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) return rejectWithValue(error.message);

      // Refresh blogs with current pagination state
      const state = getState();
      const { currentPage, pageSize, totalBlogs } = state.blog;

      // Check if we need to go back a page after deletion
      const remainingBlogs = totalBlogs - 1;
      const maxPage = Math.ceil(remainingBlogs / pageSize);
      const newPage =
        currentPage > maxPage ? Math.max(1, maxPage) : currentPage;

      dispatch(
        fetchUserBlogsThunk({
          page: newPage,
          pageSize,
        }),
      );

      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);
