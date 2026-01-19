import { useEffect } from "react";
import { FiCalendar, FiChevronRight } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../store";
import { fetchBlogByIdThunk } from "../../../thunks/blogThunks";
import { formatDate } from "../../../utils/alert";
import Loading from "./Loading";

import CommentSection from "./CommentSection";
import ImageGallery from "./ImageGallery";
import ImageLightbox from "./ImageLightbox";
import ImagesCount from "./ImagesCount";

import { useLightbox } from "../../../store/useLightbox";

const BlogDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const BREADCRUMBS = [
    { name: "Home", href: "/" },
    { name: "Create Post", href: "/create" },
  ];

  const {
    selectedBlog: blog,
    loading,
    error,
  } = useSelector((state: RootState) => state.blog);

  // Set a default empty array so TypeScript knows it exists
  const images = blog?.images ?? [];
  const lightbox = useLightbox(images.length);

  useEffect(() => {
    if (id) dispatch(fetchBlogByIdThunk(id));
    else navigate("/");
  }, [dispatch, id, navigate]);

  if (loading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <p className="text-gray-600 text-center">Blog not found</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center space-x-2 text-sm text-gray-500 mb-6"
          aria-label="Breadcrumb"
        >
          {BREADCRUMBS.map((crumb, index) => (
            <div key={crumb.name} className="flex items-center">
              <Link
                to={crumb.href}
                className="hover:text-emerald-600 transition-colors"
              >
                {crumb.name}
              </Link>
              {index < BREADCRUMBS.length - 1 && (
                <FiChevronRight className="mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </nav>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <header className="p-8 pb-0">
            <div className="flex items-center justify-between pb-6 border-b mb-6 border-gray-100">
              <div className="flex items-center gap-3">
                {/* Profile */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold">
                  {blog.author?.first_name?.[0] || "A"}
                </div>
                <div>
                  <p className="text-gray-900 font-bold">
                    {blog.author?.first_name && blog.author?.last_name
                      ? `${blog.author.first_name} ${blog.author.last_name}`
                      : "Anonymous Author"}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FiCalendar className="w-4 h-4 text-emerald-500" />
                    <time>{formatDate(blog.created_at)}</time>
                  </div>
                </div>
              </div>
            </div>

            {/* Ttle */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-5">
              {blog.title}
            </h1>
          </header>

          {/* Images Gallery */}
          <ImageGallery
            images={images}
            blogTitle={blog.title}
            onImageClick={lightbox.open}
          />

          {/* Content */}
          <div className="px-8 py-3 mb-3">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {blog.content}
            </p>

            {/* Image Count*/}
            <div className="mt-4">
              {/* Image Count*/}
              <ImagesCount images={images} />
            </div>
          </div>

          {/* Comment Section */}
          {id && <CommentSection blogId={id} />}
        </article>
      </div>

      {/* Image Lightbox Modal */}
      <ImageLightbox
        images={images}
        index={lightbox.index}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
      />
    </div>
  );
};

export default BlogDetails;
