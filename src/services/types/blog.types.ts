import type { BlogWithImages } from "./blogimages.types";

export interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
  author?: {
    first_name: string;
    last_name: string;
  };
}

export interface BlogState {
  blogs: BlogWithImages[];
  userBlogs: BlogWithImages[];
  selectedBlog?: BlogWithImages;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalBlogs: number;
  searchTerm: string;
}

export interface CreateBlogInput {
  title: string;
  content: string;
  images?: File[];
}

export interface UpdateBlogInput {
  id: string;
  title: string;
  content: string;
  images?: File[];
  removedImageIds?: string[];
}
