import React, { useState } from 'react';
import CommentSection from './CommentSection'; // Import your CommentSection component

const CATEGORY_STYLES = {
  'Unknown+ Space': 'bg-pink-100 text-pink-700',
  'Mental Health': 'bg-blue-100 text-blue-700',
  'Relationships': 'bg-purple-100 text-purple-700',
  'Career Stress': 'bg-green-100 text-green-700',
  'Family Issues': 'bg-orange-100 text-orange-700',
};

const BORDER_STYLES = {
  'Unknown+ Space': 'border-primary',
  'Mental Health': 'border-tertiary',
  'Career Stress': 'border-secondary',
  'Family Issues': 'border-red-500',
};

const PostList = ({ posts, loading, handleReaction, lastPostElementRef }) => {
  const [expandedPostId, setExpandedPostId] = useState(null);
  
  const getCategoryStyle = (category) => CATEGORY_STYLES[category] || 'bg-gray-100 text-gray-700';
  const getBorderStyle = (categories) => {
    for (const category of categories) {
      if (BORDER_STYLES[category]) return BORDER_STYLES[category];
    }
    return 'border-primary';
  };

  const calculateExpirationDays = (expiresAt) => {
    try {
      const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      return days > 0 ? days : 0;
    } catch {
      return 0;
    }
  };

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="space-y-4">
      {loading && !posts.length ? (
        <div className="text-center py-8 text-gray-500">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No posts found matching your criteria</div>
      ) : (
        posts.map((post, index) => (
          <div key={post.id}>
            <div
              ref={index === posts.length - 1 ? lastPostElementRef : null}
              className={`post-card bg-white shadow rounded-lg overflow-hidden border-l-4 ${getBorderStyle(post.categories)}`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <i className="fas fa-user-secret text-gray-500"></i>
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{post.username}</span>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="timer-section flex items-center">
                    <i className="fas fa-clock mr-1"></i>
                    <span>
                      Expires in {calculateExpirationDays(post.expiresAt)} days
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3">{post.content}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className={`category-pill ${getCategoryStyle(category)}`}
                    >
                      {category}
                    </span>
                  ))}
                  {post.hashtags.map((hashtag) => (
                    <span key={hashtag} className="category-pill bg-gray-100 text-gray-700">
                      {hashtag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-1 w-full">
                    <button
                      className={`reaction-btn ${post.likes > 0 ? 'like-active' : ''}`}
                      onClick={() => handleReaction(post.id, 'like')}
                    >
                      <i className="fas fa-heart mr-1"></i>
                      <span>{post.likes}</span>
                    </button>
                    <button
                      className={`reaction-btn ${post.supports > 0 ? 'support-active' : ''}`}
                      onClick={() => handleReaction(post.id, 'support')}
                    >
                      <i className="fas fa-hands-helping mr-1"></i>
                      <span>{post.supports}</span>
                    </button>
                    <button 
                      className="reaction-btn"
                      onClick={() => toggleComments(post.id)}
                    >
                      <i className="fas fa-comment mr-1"></i>
                      <span>{post.comments}</span>
                    </button>
                    <button
                      className={`reaction-btn ml-auto ${post.bookmarked ? 'bookmark-active' : ''}`}
                      onClick={() => handleReaction(post.id, 'bookmark')}
                    >
                      <i className="fas fa-bookmark"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comment Section */}
            {expandedPostId === post.id && (
              <div className="mt-2 bg-gray-50 rounded-lg p-4">
                <CommentSection postId={post.id} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostList;