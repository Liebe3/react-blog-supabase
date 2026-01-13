import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Blog, BlogState } from "../../services/types/blog.types";

const initialState: BlogState = {
    blogs: [],
    loading: false,
    error: null
}

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers:{
        fetchBlogsStart(state) {
            state.loading = true;
            state.error = null;
        },

        fetchBlogsSuccess(state, action: PayloadAction<Blog[]>) {
            state.blogs = action.payload;
            state.loading = false;
        },

        fetchBlogsFailure(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.loading = false;
        },

        createBlog(state, action: PayloadAction<Blog>) {
            state.blogs.unshift(action.payload);
        },

        updateBlog(state, action: PayloadAction<Blog>) {
            const index = state.blogs.findIndex(blog => blog.id === action.payload.id); 
            if (index !== -1) {
                state.blogs[index] = action.payload;        }
        },

        deleteBlog(state, action: PayloadAction<string>) {
            state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        }
    }
})

export const {fetchBlogsStart, fetchBlogsSuccess, fetchBlogsFailure, createBlog, updateBlog, deleteBlog} = blogSlice.actions;
export default blogSlice.reducer;