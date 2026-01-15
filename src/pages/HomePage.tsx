import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogList from "../pages/auth/components/BlogList";
import type { Blog } from "../services/types/blog.types";
import type { AppDispatch, RootState } from "../store";
import { fetchBlogsThunk } from "../thunks/blogThunks";
import Loading from "./auth/components/Loading";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector(
    (state: RootState) => state.blog
  );

  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const blogsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBlogsThunk());
  }, [dispatch]);

  useEffect(() => {
    if (blogs.length > 0) {
      const initialBlogs = blogs.slice(0, blogsPerPage);
      setDisplayedBlogs(initialBlogs);
      setHasMore(blogs.length > blogsPerPage);
    }
  }, [blogs]);

  const loadMoreBlogs = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * blogsPerPage;
      const endIndex = startIndex + blogsPerPage;
      const newBlogs = blogs.slice(startIndex, endIndex);

      if (newBlogs.length > 0) {
        setDisplayedBlogs((prev) => [...prev, ...newBlogs]);
        setPage(nextPage);
        setHasMore(endIndex < blogs.length);
      } else setHasMore(false);

      setIsLoadingMore(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
          Recent Posts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Discover the latest stories from our community
        </p>

        {loading && displayedBlogs.length === 0 && <Loading />}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && displayedBlogs.length > 0 ? (
          <BlogList
            blogs={displayedBlogs}
            loadMore={loadMoreBlogs}
            isLoadingMore={isLoadingMore}
            hasMore={hasMore}
          />
        ) : (
          !loading &&
          !error && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No stories yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-1">
                It looks like there aren't any stories here.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HomePage;
