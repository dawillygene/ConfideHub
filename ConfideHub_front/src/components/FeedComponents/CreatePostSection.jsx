const CreatePostSection = ({ openPostModal, isAnonymous }) => {
    return (
      <div className="create-section mb-4 bg-white rounded-lg shadow p-4 cursor-pointer" onClick={openPostModal}>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <i className="fas fa-user text-gray-500"></i>
          </div>
          <div className="create-input w-full">
            <div className="w-full p-2 border border-gray-300 rounded text-gray-500 bg-gray-50">
              Share a confession...
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-3 pt-3 flex justify-around">
          <div className={`reaction-btn ${isAnonymous ? 'text-yellow-500' : ''}`}>
            <i className="fas fa-key mr-2"></i>
            <span>{isAnonymous ? 'Anonymous' : 'Public'}</span>
          </div>
          <div className="reaction-btn">
            <i className="fas fa-image text-green-500 mr-2"></i>
            <span>Photo</span>
          </div>
          <div className="reaction-btn">
            <i className="fas fa-paper-plane text-purple-500 mr-2"></i>
            <span>Share</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default CreatePostSection;