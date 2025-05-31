import React, { useState, useEffect } from 'react';
import CommentSection from './CommentSection';

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

const MAX_PREVIEW_LENGTH = 100;

const PostList = ({ posts, loading, handleReaction, lastPostElementRef }) => {
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [expandedContentId, setExpandedContentId] = useState(null);
  const [showLoading, setShowLoading] = useState(false);
  
  useEffect(() => {
    let timeout;
    if (loading) {
      // Only show loading indicator after a small delay to prevent flickering
      timeout = setTimeout(() => setShowLoading(true), 200);
    } else {
      setShowLoading(false);
      clearTimeout(timeout);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

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

  const toggleContent = (postId) => {
    setExpandedContentId(expandedContentId === postId ? null : postId);
  };

  const getPreviewText = (content) => {
    if (content.length <= MAX_PREVIEW_LENGTH) return content;
    return content.substring(0, MAX_PREVIEW_LENGTH);
  };

  const cleanMarkdown = (text) => {
    if (!text) return '';
    // Remove ** markdown syntax for bold text
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  };

  return (
    <div className="space-y-6">
      {showLoading && !posts.length ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
            {/* Animated loading spinner */}
            <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
            <span className="ml-14 text-gray-600 font-medium">Loading posts...</span>
          </div>
        </div>
      ) : posts.length === 0 && !loading ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg animate-fade-in">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">No posts matching your criteria were found.</p>
        </div>
      ) : (
        <>
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                ref={index === posts.length - 1 ? lastPostElementRef : null}
                className={`post-card bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden border-l-4 transition-all duration-300 ${getBorderStyle(post.categories)}`}
              >
                <div className="p-5">
                  {/* Header Section */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3 shadow-sm">
                        <i className="fas fa-user-secret text-gray-600"></i>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800">{post.username}</span>
                        <div className="text-xs text-gray-500 flex items-center mt-0.5">
                          <i className="fas fa-clock mr-1 text-xs"></i>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="timer-section flex items-center bg-amber-50 px-3 py-1.5 rounded-full text-xs font-medium text-amber-700">
                      <i className="fas fa-hourglass-half mr-1.5"></i>
                      <span>
                        {calculateExpirationDays(post.expiresAt) === 0 ? (
                          <span className="font-medium text-red-600">Expired</span>
                        ) : (
                          <>Expires in <span className="font-bold">{calculateExpirationDays(post.expiresAt)}</span> days</>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Title Section - Updated */}
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {cleanMarkdown(post.generatedTitle)}
                  </h3>
                  
                  {/* Content Section */}
                  <div className="relative mb-4">
                    <div className="text-gray-600 leading-relaxed">
                      {expandedContentId === post.id ? (
                        post.content
                      ) : (
                        <>
                          {getPreviewText(post.content)}
                          {post.content.length > MAX_PREVIEW_LENGTH && (
                            <span className="text-gray-400">...</span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {post.content.length > MAX_PREVIEW_LENGTH && (
                      <div className="mt-3">
                        <button 
                          onClick={() => toggleContent(post.id)}
                          className={`
                            inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                            ${expandedContentId === post.id 
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}
                            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          `}
                        >
                          {expandedContentId === post.id ? (
                            <>
                              <i className="fas fa-chevron-up mr-1.5 text-xs"></i>
                              Show less
                            </>
                          ) : (
                            <>
                              <i className="fas fa-chevron-down mr-1.5 text-xs"></i>
                              Read more
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Category Section */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.categories.map((category) => (
                      <span
                        key={category}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryStyle(category)} shadow-sm`}
                      >
                        {category}
                      </span>
                    ))}
                    {post.hashtags.map((hashtag) => (
                      <span 
                        key={hashtag} 
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Actions Section */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2 w-full">
                      <button
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${post.likes > 0 ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                        onClick={() => handleReaction(post.id, 'like')}
                      >
                        <i className="fas fa-heart mr-1.5"></i>
                        <span>{post.likes}</span>
                      </button>
                      
                      <button
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${post.supports > 0 ? 'text-blue-500 bg-blue-50 hover:bg-blue-100' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                        onClick={() => handleReaction(post.id, 'support')}
                      >
                        <i className="fas fa-hands-helping mr-1.5"></i>
                        <span>{post.supports}</span>
                      </button>
                      
                      <button 
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${expandedPostId === post.id ? 'text-purple-500 bg-purple-50 hover:bg-purple-100' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                        onClick={() => toggleComments(post.id)}
                      >
                        <i className="fas fa-comment mr-1.5"></i>
                        <span>{post.comments}</span>
                      </button>
                      
                      <button
                        className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium ml-auto ${post.bookmarked ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-500 hover:bg-gray-100'} transition-colors`}
                        onClick={() => handleReaction(post.id, 'bookmark')}
                      >
                        <i className={`fas fa-bookmark ${post.bookmarked ? 'text-yellow-500' : ''}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comment Section */}
              {expandedPostId === post.id && (
                <div className="mt-2 bg-gray-50 rounded-lg p-5 shadow-inner opacity-100">
                  <CommentSection postId={post.id} />
                </div>
              )}
            </div>
          ))}
          
          {/* Loading more indicator at bottom */}
          {loading && posts.length > 0 && (
            <div className="flex justify-center py-6">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostList;