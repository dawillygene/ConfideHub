import React, { useState } from 'react';

const ConfessMain = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [confessions, setConfessions] = useState([
    {
      id: 1,
      user: 'User_5T9X',
      time: '12 hours ago',
      expires: '23 hours',
      title: "I don't know how to tell my partner I'm struggling with anxiety...",
      content: "I've been dealing with anxiety for years but have never told my partner. They've noticed I'm acting different lately, but I don't know how to open up about it. I'm afraid they'll think I'm too much to handle or they'll see me differently...",
      categories: ['Mental Health', 'Relationships', '#Anxiety'],
      likes: 24,
      support: 18,
      comments: 7,
      bookmarked: false,
      borderColor: 'border-tertiary'
    },
    {
      id: 2,
      user: 'User_9Z7Y',
      time: '3 hours ago',
      expires: '6 days',
      title: 'I got a job offer that pays more, but I love my current team...',
      content: 'I received a job offer that would increase my salary by 30%, but I really love my current team and the work environment. Money isn’t everything, but it would help me pay off my student loans faster. I’m torn between loyalty and financial stability...',
      categories: ['Career Stress', '#JobDecision', '#Money'],
      likes: 12,
      support: 31,
      comments: 22,
      bookmarked: false,
      borderColor: 'border-secondary'
    },
    {
      id: 3,
      user: 'User_3D2F',
      time: '1 day ago',
      expires: '6 days',
      title: 'I came out to my parents and it didn’t go as expected...',
      content: 'After years of hiding, I finally came out to my parents last weekend. I expected anger or disappointment, but they just hugged me and said they already knew. I feel relieved but also confused about why I spent so many years afraid. Anyone else experience something similar?',
      categories: ['invalid+ Space', 'Family Issues', '#ComingOut'],
      likes: 86,
      support: 54,
      comments: 19,
      bookmarked: true,
      borderColor: 'border-primary'
    },
    {
      id: 4,
      user: 'User_8R1P',
      time: '4 hours ago',
      expires: '23 hours',
      title: 'I think I’m failing as a parent and I don’t know what to do',
      content: 'My teenager is struggling in school and with friends. I work two jobs to support us and don’t have enough time to help with homework or be there when they need to talk. I feel like I’m failing them, but I don’t know how to balance everything...',
      categories: ['Family Issues', '#Parenting', 'Mental Health'],
      likes: 42,
      support: 67,
      comments: 14,
      bookmarked: false,
      borderColor: 'border-red-500'
    },
    {
      id: 5,
      user: 'User_2K7L',
      time: '2 days ago',
      expires: '5 days',
      title: 'I secretly hate my dream job and don’t know what to do next',
      content: 'I worked so hard to get what I thought was my dream job. It took years of education and struggling, and now that I have it...I hate it. The culture is toxic, the hours are brutal, and the work isn’t fulfilling. I feel trapped because I spent so much time getting here...',
      categories: ['Career Stress', 'Mental Health', '#BurnOut'],
      likes: 36,
      support: 28,
      comments: 11,
      bookmarked: false,
      borderColor: 'border-tertiary'
    }
  ]);

  const filters = [
    'All',
    'Mental Health',
    'Relationships',
    'Career Stress',
    'Family Issues',
    'invalid+ Space'
  ];

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLike = (id) => {
    setConfessions(confessions.map(confession =>
      confession.id === id ? { ...confession, likes: confession.likes + 1 } : confession
    ));
  };

  const handleSupport = (id) => {
    setConfessions(confessions.map(confession =>
      confession.id === id ? { ...confession, support: confession.support + 1 } : confession
    ));
  };

  const handleBookmark = (id) => {
    setConfessions(confessions.map(confession =>
      confession.id === id ? { ...confession, bookmarked: !confession.bookmarked } : confession
    ));
  };

  const filteredConfessions = confessions
    .filter(confession =>
      activeFilter === 'All' ||
      confession.categories.includes(activeFilter)
    )
    .filter(confession =>
      confession.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      confession.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'Trending') return b.likes - a.likes;
      if (sortOption === 'Most Supported') return b.support - a.support;
      return 0; // Newest is default
    });

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Explore Confessions</h1>
        <p className="text-gray-600 mt-1">
          Discover anonymous confessions. Connect with others through shared experiences.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
            {filters.map(filter => (
              <button
                key={filter}
                className={`btn-filter px-3 py-1 rounded-full text-sm font-medium border transition ${
                  activeFilter === filter
                    ? 'active bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <select
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option>Sort by: Newest</option>
                <option>Sort by: Trending</option>
                <option>Sort by: Most Supported</option>
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
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </div>
        </div>
      </div>

      {/* Confessions Feed */}
      <div className="space-y-5">
        {filteredConfessions.map(confession => (
          <div
            key={confession.id}
            className={`confession-card bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${confession.borderColor} cursor-pointer`}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{confession.user}</span>
                  <span className="ml-2 text-xs text-gray-500">{confession.time}</span>
                </div>
                <div className="flex items-center text-xs text-red-500">
                  <i className="fas fa-clock timer-icon mr-1"></i>
                  <span>Expires in {confession.expires}</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-2">{confession.title}</h3>
              <p className="text-gray-600 mb-3">{confession.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {confession.categories.map((category, index) => (
                  <span
                    key={index}
                    className={`category-pill px-2 py-1 rounded-full text-xs font-medium ${
                      category.startsWith('#')
                        ? 'bg-gray-100 text-gray-700'
                        : {
                            'Mental Health': 'bg-blue-100 text-blue-700',
                            'Relationships': 'bg-purple-100 text-purple-700',
                            'Career Stress': 'bg-green-100 text-green-700',
                            'Family Issues': 'bg-orange-100 text-orange-700',
                            'invalid+ Space': 'bg-pink-100 text-pink-700'
                          }[category] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex space-x-4">
                  <div className="flex items-center text-gray-500">
                    <button
                      className="hover:bg-red-50 hover:text-red-500 p-1 rounded-full transition"
                      onClick={() => handleLike(confession.id)}
                    >
                      <i className="fas fa-heart mr-1"></i>
                    </button>
                    <span>{confession.likes}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <button
                      className="hover:bg-yellow-50 hover:text-yellow-500 p-1 rounded-full transition"
                      onClick={() => handleSupport(confession.id)}
                    >
                      <i className="fas fa-hands-helping mr-1"></i>
                    </button>
                    <span>{confession.support}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <i className="fas fa-comment mr-1"></i>
                    <span>{confession.comments} comments</span>
                  </div>
                </div>
                <div>
                  <button
                    className={`transition ${
                      confession.bookmarked ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
                    }`}
                    onClick={() => handleBookmark(confession.id)}
                  >
                    <i className="fas fa-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg">
          Load More Confessions
        </button>
      </div>

      {/* Support Section */}
      <div className="mt-12 bg-white rounded-lg shadow-md p-6 border-t-4 border-secondary">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Need Immediate Support?</h3>
        <p className="text-gray-600 mb-4">
          If you’re experiencing a crisis or need immediate assistance, please reach out to these resources:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h4 className="font-semibold text-red-700">Crisis Support</h4>
            <p className="text-sm text-gray-700 mt-1">24/7 Hotline: 1-800-273-8255</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-semibold text-blue-700">Mental Health</h4>
            <p className="text-sm text-gray-700 mt-1">Text HOME to 741741</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-purple-700">invalid+ Support</h4>
            <p className="text-sm text-gray-700 mt-1">Call: 1-866-488-7386</p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-500 hover:text-blue-700 font-medium transition">
            View All Support Resources <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>
      </div>
    </main>
  );
};

export default ConfessMain;




