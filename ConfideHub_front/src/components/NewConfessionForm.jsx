import React, { useState } from 'react';


const NewConfessionForm = () => {
  const [category, setCategory] = useState('');
  const [confession, setConfession] = useState('');
  const [tags, setTags] = useState('');
  const [timer, setTimer] = useState('Never (Keep forever)');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ category, confession, tags, timer });
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Share Your Confession</h2>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-primary border-opacity-20 flex items-start">
            <i className="fas fa-info-circle text-primary mt-1 mr-3"></i>
            <p className="text-sm text-gray-600">
              Your identity is protected. You're posting as{' '}
              <span className="font-medium">Anonymous_User45T9X</span> for this confession only.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Choose a Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                className="category-pill px-4 py-2 rounded-full bg-primary text-white text-sm hover:bg-opacity-90 transition"
                onClick={() => setCategory('Mental Health')}
              >
                Mental Health
              </button>
              {/* Add other category buttons */}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Your Confession</label>
            <textarea
              rows="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share what's on your mind..."
              value={confession}
              onChange={(e) => setConfession(e.target.value)}
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Add Tags (Optional)</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <span className="text-gray-500 mr-2">#</span>
              <input
                type="text"
                className="flex-grow focus:outline-none"
                placeholder="anxiety, work, family (separate with commas)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Self-Destruct Timer (Optional)</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
            >
              <option>Never (Keep forever)</option>
              <option>24 hours</option>
              <option>3 days</option>
              <option>7 days</option>
              <option>30 days</option>
            </select>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Additional buttons for microphone and image upload */}
            </div>

            <div className="flex space-x-3">
              <button className="px-5 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
                Save Draft
              </button>
              <button
                className="px-5 py-2 bg-primary text-white rounded-full hover:bg-opacity-90 transition pulse-animation"
                onClick={handleSubmit}
              >
                <i className="fas fa-paper-plane mr-2"></i>Post Anonymously
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewConfessionForm;