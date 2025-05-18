import { motion } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
];

const FilterSection = ({ filter, handleFilterChange }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        {/* Category Filters */}
        <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                filter.category === category
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
              onClick={() => handleFilterChange({ category })}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative min-w-[160px]">
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <select
              className="w-full pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white/80 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 appearance-none transition-all"
              value={filter.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
            >
              <option value="newest">Newest</option>
              <option value="trending">Trending</option>
              <option value="mostSupported">Most Supported</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div 
        whileFocus={{ scale: 1.01 }}
        className="relative"
      >
        <input
          type="text"
          placeholder="Search confessions..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          value={filter.searchQuery}
          onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilterSection;