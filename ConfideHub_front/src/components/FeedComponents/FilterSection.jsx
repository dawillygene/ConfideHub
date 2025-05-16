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
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
          <div className="flex flex-wrap gap-2 mb-3 md:mb-0 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`btn-filter px-3 py-1 rounded-full text-sm font-medium border transition ${
                  filter.category === category
                    ? 'active'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleFilterChange({ category })}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filter.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              >
                <option value="newest">Newest</option>
                <option value="trending">Trending</option>
                <option value="mostSupported">Most Supported</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search confessions..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={filter.searchQuery}
            onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>
    );
  };
  
  export default FilterSection;