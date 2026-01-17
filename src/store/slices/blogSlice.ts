import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Blog, BlogState } from "../../services/types/blog.types";

import {
  createBlogThunk,
  deleteBlogThunk,
  fetchBlogByIdThunk,
  fetchBlogsThunk,
  fetchUserBlogsThunk,
  updateBlogThunk,
} from "../../thunks/blogThunks";

const initialState: BlogState = {
  blogs: [],
  userBlogs: [],
  selectedBlog: undefined,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalBlogs: 0,
  searchTerm: "",
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetBlogs(state) {
      state.blogs = [];
      state.userBlogs = [];
      state.loading = false;
      state.error = null;
      state.currentPage = 1;
      state.searchTerm = "";
    },

    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      // Reset to page 1 when searching
      if (action.payload !== state.searchTerm) {
        state.currentPage = 1;
      }
    },

    clearSearch(state) {
      state.searchTerm = "";
      state.currentPage = 1;
    },
  },

  extraReducers: (builder) => {
    // Fetch
    builder
      .addCase(fetchBlogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchBlogsThunk.fulfilled,
        (state, action: PayloadAction<Blog[]>) => {
          state.blogs = action.payload;
          state.loading = false;
        }
      )

      .addCase(fetchBlogsThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch blogs";
        state.loading = false;
      })

      // Fetch user blogs (dashboard)
      .addCase(fetchUserBlogsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        fetchUserBlogsThunk.fulfilled,
        (state, action: PayloadAction<{ blogs: Blog[]; total: number }>) => {
          state.userBlogs = action.payload.blogs;
          state.totalBlogs = action.payload.total;
          state.loading = false;
        }
      )

      .addCase(fetchUserBlogsThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch user blogs";
        state.loading = false;
      })

      // Fetch single blog
      .addCase(fetchBlogByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedBlog = undefined;
      })

      .addCase(
        fetchBlogByIdThunk.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.selectedBlog = action.payload;
          state.loading = false;
        }
      )

      .addCase(fetchBlogByIdThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to fetch blog";
        state.loading = false;
      })

      // Create
      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        createBlogThunk.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          state.blogs.unshift(action.payload);
          state.loading = false;
          // Reset to page 1 after creating
          state.currentPage = 1;
        }
      )

      .addCase(createBlogThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to create blog";
        state.loading = false;
      })

      // Update
      .addCase(updateBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        updateBlogThunk.fulfilled,
        (state, action: PayloadAction<Blog>) => {
          const index = state.blogs.findIndex(
            (blog) => blog.id === action.payload.id
          );

          if (index !== -1) {
            state.blogs[index] = action.payload;
          }
          state.loading = false;
        }
      )

      .addCase(updateBlogThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to update blog";
        state.loading = false;
      })

      // Delete
      .addCase(deleteBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        deleteBlogThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.blogs = state.blogs.filter(
            (blog) => blog.id !== action.payload
          );
          state.loading = false;
        }
      )

      .addCase(deleteBlogThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete blog";
        state.loading = false;
      });
  },
});

export const {
  clearError,
  resetBlogs,
  setCurrentPage,
  setSearchTerm,
  clearSearch,
} = blogSlice.actions;
export default blogSlice.reducer;
