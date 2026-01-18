import type { Blog } from "./blog.types";

export interface BlogImage {
  id: string;
  blog_id: string;
  image_url: string;
  created_at: string;
}

export interface BlogWithImages extends Blog {
  images?: BlogImage[];
}


