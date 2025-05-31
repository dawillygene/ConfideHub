import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
];

const EXPIRY_OPTIONS = [
  { value: 'HOURS_24', label: '24 Hours', description: 'Quick confession', icon: '⏰' },
  { value: 'DAYS_7', label: '7 Days', description: 'Extended discussion', icon: '📅' },
  { value: 'NEVER', label: 'Forever', description: 'Permanent post', icon: '♾️' }
];

const PostModal = ({
  isOpen,
  onClose,
  postData,
  setPostData,
  isAnonymous,
  setIsAnonymous,
  isPosting,
  handleCreatePost,
  handlePostDataChange,
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle expiry duration change
  const handleExpiryChange = (e) => {
    setPostData(prev => ({
      ...prev,
      expiryDuration: e.target.value
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/20"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            ref={modalRef}
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden border border-white/20"
            style={{ maxHeight: '90vh' }}
          >
            <div className="px-6 py-4 border-b border-white/20 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">Share Your Confession</h3>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={isPosting}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
              <form onSubmit={handleCreatePost}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isAnonymous ? 'bg-yellow-100/80' : 'bg-blue-100/80'}`}>
                    {isAnonymous ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-lg">
                      {isAnonymous ? 'Anonymous User (Random ID will be assigned)' : 'Your Name'}
                    </p>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center transition-colors"
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      disabled={isPosting}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z" clipRule="evenodd" />
                      </svg>
                      {isAnonymous ? 'Anonymous' : 'Public'}
                    </motion.button>
                  </div>
                </div>

                {/* Content Field */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Content</label>
                  <textarea
                    name="content"
                    value={postData.content}
                    onChange={handlePostDataChange}
                    className="w-full border border-gray-200/70 bg-white/70 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
                    rows="8"
                    placeholder="What's on your heart? Share your thoughts... The title will be generated automatically using AI."
                    required
                    disabled={isPosting}
                  />
                  <p className="text-xs text-gray-500 mt-2 ml-1">Use #hashtags to categorize your confession. Title will be generated automatically.</p>
                </div>

                {/* Category Field */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
                  <select
                    name="category"
                    value={postData.category}
                    onChange={handlePostDataChange}
                    className="w-full border border-gray-200/70 bg-white/70 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    disabled={isPosting}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expiry Duration Options */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-6"
                >
                  <label className="block text-gray-700 text-sm font-medium mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Post Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPIRY_OPTIONS.map((option) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative cursor-pointer rounded-lg border p-3 transition-all ${
                          postData.expiryDuration === option.value
                            ? 'border-blue-500 bg-blue-50/70 text-blue-700'
                            : 'border-gray-200/70 bg-white/50 hover:bg-gray-50/70'
                        } ${isPosting ? 'pointer-events-none opacity-50' : ''}`}
                      >
                        <input
                          type="radio"
                          name="expiryDuration"
                          value={option.value}
                          checked={postData.expiryDuration === option.value}
                          onChange={handleExpiryChange}
                          className="sr-only"
                          disabled={isPosting}
                        />
                        <div className="text-center">
                          <div className="text-lg mb-1">{option.icon}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                        </div>
                        {postData.expiryDuration === option.value && (
                          <div className="absolute top-2 right-2">
                            <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </motion.label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-1">
                    {postData.expiryDuration === 'NEVER' 
                      ? 'This post will remain visible permanently'
                      : `This post will self-destruct after ${postData.expiryDuration === 'HOURS_24' ? '24 hours' : '7 days'}`
                    }
                  </p>
                </motion.div>

                <div className="flex justify-end space-x-3 mt-8">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300/70 rounded-xl text-gray-700 hover:bg-gray-100/50 focus:outline-none transition-all"
                    disabled={isPosting}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isPosting}
                  >
                    {isPosting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Posting...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        {isAnonymous ? 'Share Anonymous Confession' : 'Share Confession'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;