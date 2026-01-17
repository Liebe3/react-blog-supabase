import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../services/supabase";
import type { RootState } from "../store";

import type {
  Blog,
  CreateBlogInput,
  UpdateBlogInput,
} from "../services/types/blog.types";

interface FetchUserBlogsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Fetch all blogs thunk
export const fetchBlogsThunk = createAsyncThunk<
  Blog[],
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
      // Return blogs without author info if profiles fetch fails
      return blogsData as Blog[];
    }

    // Create a map of author_id to profile
    const profilesMap = new Map(
      profilesData?.map((profile) => [profile.id, profile]) || []
    );

    // Combine blogs with author information
    const blogsWithAuthors = blogsData.map((blog) => ({
      ...blog,
      author: profilesMap.get(blog.author_id) || undefined,
    }));

    return blogsWithAuthors as Blog[];
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Fetch user blogs with pagination and search thunk
export const fetchUserBlogsThunk = createAsyncThunk<
  { blogs: Blog[]; total: number },
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

    return { blogs: data as Blog[], total: count ?? 0 };
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Fetch blog by ID
export const fetchBlogByIdThunk = createAsyncThunk<
  Blog,
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

    return { ...blogData, author: profileData } as Blog;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

// Create Thunk
export const createBlogThunk = createAsyncThunk<
  Blog,
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

      const { data, error } = await supabase
        .from("blogs")
        .insert([{ ...input, author_id: user.id }])
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Refresh blogs with current pagination state
      const state = getState();
      dispatch(
        fetchUserBlogsThunk({
          page: 1, // Go to first page after creating
          pageSize: state.blog.pageSize,
        })
      );

      return data as Blog;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Update Thunk
export const updateBlogThunk = createAsyncThunk<
  Blog,
  UpdateBlogInput,
  { rejectValue: string; state: RootState }
>(
  "blog/updateBlog",
  async (input: UpdateBlogInput, { rejectWithValue, dispatch, getState }) => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .update({ title: input.title, content: input.content })
        .eq("id", input.id)
        .select()
        .single();

      if (error) return rejectWithValue(error.message);

      // Refresh blogs with current pagination state
      const state = getState();
      dispatch(
        fetchUserBlogsThunk({
          page: state.blog.currentPage,
          pageSize: state.blog.pageSize,
        })
      );

      return data as Blog;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Delete Thunk
export const deleteBlogThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>(
  "blog/deleteBlog",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
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
        })
      );

      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
