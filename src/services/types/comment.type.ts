export interface Comment {
  id: string;
  blog_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommentImage {
  id: string;
  comment_id: string;
  image_url: string;
  created_at: string;
}

export interface CommentWithImage extends Comment {
  image?: CommentImage;
  author?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  replies?: CommentWithImage[];
}

export interface CommentState {
  comments: CommentWithImage[];
  loading: boolean;
  error: string | null;
}

export interface CreateCommentInput {
  blog_id: string;
  content: string | null;
  parent_comment_id?: string | null;
  image?: File;
}

export interface UpdateCommentInput {
  id: string;
  content: string | null;
  image?: File;
  removeImage?: boolean;
}