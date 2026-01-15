import { motion } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";

interface FilterSearchProps {
  searchTerm: string;
  handleSearch: (search: string) => void;
  clearFilters: () => void;
  debouncedSearch: string;
}

const FilterSearch: React.FC<FilterSearchProps> = ({
  searchTerm,
  handleSearch,
  clearFilters,
  debouncedSearch,
}) => {
  const hasActiveFilters = debouncedSearch !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Search Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search by Title
            </label>
          </div>
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 text-sm cursor-pointer"
            >
              <FiX className="w-4 h-4 mr-1" />
              Clear
            </motion.button>
          )}
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Search blogs by title..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-600 transition-all duration-200 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="w-5 h-5 cursor-pointer" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSearch;
