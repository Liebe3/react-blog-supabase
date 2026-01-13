export interface Blog {
    id: string;
		title: string;
		content: string;
		author_id: string;
		created_at: string;
		updated_at: string;
}

export interface BlogState {
	blogs: Blog[];
	loading: boolean;
	error: string | null;
}

export interface CreateBlogInput{
	title: string;
	content: string;
}

export interface UpdateBlogInput{
	id: string
	title: string;
	content: string
}