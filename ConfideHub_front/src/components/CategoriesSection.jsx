import React from 'react';
const CategoriesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore By Category</h2>
          <p className="text-gray-600">Find confessions that resonate with your experiences</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Category cards */}
        </div>

        <div className="mt-12">
          <h3 className="text-xl font-bold mb-4">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {/* Trending tags */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;