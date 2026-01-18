import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import type {
  CreateBlogInput,
  UpdateBlogInput,
} from "../services/types/blog.types";
import type { BlogWithImages } from "../services/types/blogimages.types";
import type { AppDispatch, RootState } from "../store";
import {
  clearSearch,
  setCurrentPage,
  setSearchTerm,
} from "../store/slices/blogSlice";
import {
  createBlogThunk,
  deleteBlogThunk,
  fetchUserBlogsThunk,
  updateBlogThunk,
} from "../thunks/blogThunks";
import { ConfirmDelete, ShowError, ShowSucess } from "../utils/alert";
import BlogForm from "./auth/components/BlogFrom";
import BlogTable from "./auth/components/BlogTable";
import BlogViewModal from "./auth/components/BlogViewModal";
import FilterSearch from "./auth/components/FilterSearch";
import Loading from "./auth/components/Loading";

const CreateBlogPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    userBlogs,
    loading,
    error,
    currentPage,
    pageSize,
    totalBlogs,
    searchTerm,
  } = useSelector((state: RootState) => state.blog);

  const totalPages = Math.ceil(totalBlogs / pageSize);

  // Modal state
  const [selectedBlog, setSelectedBlog] = useState<BlogWithImages | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [isDeleting, setIsDeleting] = useState(false);

  // Local search state for input
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Fetch blogs on mount and when page or search changes
  useEffect(() => {
    dispatch(
      fetchUserBlogsThunk({
        page: currentPage,
        pageSize,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, pageSize, debouncedSearch]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(localSearchTerm.trim());
      dispatch(setSearchTerm(localSearchTerm.trim()));
      // Reset to page 1 when search changes
      if (localSearchTerm.trim() !== searchTerm) {
        dispatch(setCurrentPage(1));
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localSearchTerm, dispatch, searchTerm]);

  const handleSearch = (search: string) => {
    setLocalSearchTerm(search);
  };

  const handleClearFilters = () => {
    setLocalSearchTerm("");
    setDebouncedSearch("");
    dispatch(clearSearch());
    dispatch(fetchUserBlogsThunk({ page: 1, pageSize }));
  };

  // Open modal for creating blog
  const handleOpenCreate = () => {
    setSelectedBlog(null);
    setMode("create");
    setIsModalOpen(true);
  };

  // Open modal for editing blog
  const handleEditBlog = (blog: BlogWithImages) => {
    setSelectedBlog(blog);
    setMode("update");
    setIsModalOpen(true);
  };

  // Open modal for viewing blog
  const handleViewBlog = (blog: BlogWithImages) => {
    setSelectedBlog(blog);
    setIsViewModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: CreateBlogInput | UpdateBlogInput) => {
    try {
      if (mode === "create") {
        await dispatch(createBlogThunk(data as CreateBlogInput)).unwrap();
        ShowSucess("Blog created successfully");
      } else {
        await dispatch(updateBlogThunk(data as UpdateBlogInput)).unwrap();
        ShowSucess("Blog updated successfully");
      }
      setIsModalOpen(false);
      setSelectedBlog(null);
    } catch (error) {
      ShowError((error as string) || "An error occurred");
    }
  };

  // Delete blog
  const handleDelete = (id: string) => {
    ConfirmDelete(
      dispatch,
      deleteBlogThunk,
      id,
      "Blog deleted successfully",
      setIsDeleting,
    );
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    setMode("create");
  };

  // Close view modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedBlog(null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  if (loading && userBlogs.length === 0) {
    return <Loading />;
  }

  if (isDeleting) return <Loading />;

  if (error && userBlogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800"
        >
          <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </motion.div>
      </div>
    );
  }

  const hasActiveFilters = debouncedSearch !== "";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <h2 className="text-3xl font-bold text-emerald-600 mb-2">
            Blog Management
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create, edit, and manage your blog posts
          </p>
        </motion.div>

        {/* Search Filter */}
        <FilterSearch
          searchTerm={localSearchTerm}
          handleSearch={handleSearch}
          clearFilters={handleClearFilters}
          debouncedSearch={debouncedSearch}
        />

        {/* Blog Table */}
        <BlogTable
          blogs={userBlogs}
          onEdit={handleEditBlog}
          onDelete={handleDelete}
          onView={handleViewBlog}
          handleOpenCreate={handleOpenCreate}
          hasActiveFilters={hasActiveFilters}
          clearFilters={handleClearFilters}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalBlogs={totalBlogs}
          setCurrentPage={handlePageChange}
        />

        {/* Edit/Create Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {mode === "create" ? "Create New Blog" : "Edit Blog"}
                </h3>
              </div>
              <div className="p-6">
                <BlogForm
                  mode={mode}
                  selectedBlog={selectedBlog}
                  onSubmit={handleFormSubmit}
                  onCancel={handleCloseModal}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* View Modal */}
        {selectedBlog && (
          <BlogViewModal
            blog={selectedBlog}
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
          />
        )}
      </div>
    </div>
  );
};

export default CreateBlogPage;
