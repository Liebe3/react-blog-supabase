import { useEffect, useState } from "react";

interface Blog {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

const initialForm = {
  title: "",
  content: "",
};

const formModes = {
  Create: "create",
  Update: "update",
};

interface BlogFormProps {
  mode?: string;
  selectedBlog?: Blog | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  mode = formModes.Create,
  selectedBlog,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (mode === formModes.Update && selectedBlog) {
      setForm({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [mode, selectedBlog]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (mode === formModes.Update && selectedBlog) {
      onSubmit({ ...form, id: selectedBlog.id });
    } else {
      onSubmit(form);
    }
  };

  const handleReset = () => {
    if (mode === formModes.Create) {
      setForm(initialForm);
    } else if (selectedBlog) {
      setForm({
        title: selectedBlog.title || "",
        content: selectedBlog.content || "",
      });
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Blog Title */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Blog Title
          </label>
          <input
            value={form.title}
            type="text"
            name="title"
            placeholder="Enter blog title..."
            required
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Blog Content */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            value={form.content}
            name="content"
            rows={8}
            placeholder="Write your blog content here..."
            onChange={handleChange}
            required
            className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium shadow-lg transition duration-200 cursor-pointer"
          >
            {mode === "create" ? "Create Blog" : "Update Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
