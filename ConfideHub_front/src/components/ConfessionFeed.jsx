import React from 'react';

const ConfessionFeed = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Recent Confessions</h2>
          <div className="flex items-center">
            <span className="mr-2 text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Most Recent</option>
              <option>Most Supported</option>
              <option>Most Commented</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Confession cards */}
        </div>

        <div className="mt-10 text-center">
          <button className="px-6 py-3 bg-white border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition duration-300">
            Load More Confessions
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfessionFeed;