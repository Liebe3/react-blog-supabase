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
  blogs: Blog[];
  userBlogs: Blog[];
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
}

export interface UpdateBlogInput {
  id: string;
  title: string;
  content: string;
}
