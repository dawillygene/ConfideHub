import { useEffect, useRef } from 'react';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
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
  fileInputRef,
  triggerFileInput,
  handleImageUpload,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 overflow-hidden transform transition-all"
        style={{ maxHeight: '90vh' }}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">Create a Confession</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <form onSubmit={handleCreatePost}>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <i className="fas fa-user-secret text-gray-500"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{isAnonymous ? 'Anonymous User' : 'Your Name'}</p>
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  <i className={`fas ${isAnonymous ? 'fa-lock' : 'fa-lock-open'} mr-1`}></i>
                  {isAnonymous ? 'Anonymous' : 'Public'}
                </button>
              </div>
            </div>
            <div className="mb-4">
              <textarea
                name="content"
                value={postData.content}
                onChange={handlePostDataChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                placeholder="What's on your mind? Share your confession..."
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Use #hashtags to categorize your post</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={postData.category}
                onChange={handlePostDataChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
              {postData.image ? (
                <div className="relative mt-2 mb-3">
                  <img
                    src={URL.createObjectURL(postData.image)}
                    alt="Upload preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setPostData({ ...postData, image: null })}
                    className="absolute top-2 right-2 bg-white text-red-500 p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition"
                >
                  <i className="fas fa-image text-gray-400 text-2xl mb-2"></i>
                  <p className="text-sm text-gray-500">Add a photo to your confession</p>
                </button>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 flex items-center justify-center"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Share Confession
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostModal;