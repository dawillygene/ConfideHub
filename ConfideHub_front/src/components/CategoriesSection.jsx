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
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-brain text-2xl text-primary"></i>
                    </div>
                    <h3 className="font-bold">Mental Health</h3>
                    <p className="text-sm text-gray-500">1.2K confessions</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-heart text-2xl text-secondary"></i>
                    </div>
                    <h3 className="font-bold">Relationships</h3>
                    <p className="text-sm text-gray-500">856 confessions</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-tertiary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-briefcase text-2xl text-tertiary"></i>
                    </div>
                    <h3 className="font-bold">Career Stress</h3>
                    <p className="text-sm text-gray-500">647 confessions</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-home text-2xl text-primary"></i>
                    </div>
                    <h3 className="font-bold">Family Issues</h3>
                    <p className="text-sm text-gray-500">723 confessions</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-flag-checkered text-2xl text-secondary"></i>
                    </div>
                    <h3 className="font-bold">invalid+ Safe Space</h3>
                    <p className="text-sm text-gray-500">512 confessions</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition duration-300">
                    <div className="w-16 h-16 bg-tertiary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-ellipsis-h text-2xl text-tertiary"></i>
                    </div>
                    <h3 className="font-bold">Other Topics</h3>
                    <p className="text-sm text-gray-500">1.5K confessions</p>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-xl font-bold mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#Anxiety</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#Breakup</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#JobHunting</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#Depression</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#CollegeStress</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#FamilySecrets</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#ComingOut</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#Burnout</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#LongDistance</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">#SelfCare</span>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CategoriesSection;