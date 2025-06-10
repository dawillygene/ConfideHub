import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreBookmarks, setHasMoreBookmarks] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API configuration
  const API_BASE_URL = '/api/posts/bookmarks';
  const BOOKMARK_TOGGLE_URL = '/api/posts';

  const axiosConfig = {
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Get authentication headers
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      ...axiosConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }, []);

  // Fetch bookmarked posts
  const fetchBookmarks = useCallback(async (pageNum = 0, append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        ...axiosConfig,
        headers: getAuthHeaders(),
        params: {
          page: pageNum,
          size: 10,
        },
      });

      const { content, totalPages, last } = response.data;
      
      setBookmarks(prev => {
        const newBookmarksData = append ? [...prev, ...content] : content;
        return newBookmarksData.filter((bookmark, index, self) =>
          index === self.findIndex(b => b.id === bookmark.id)
        );
      });
      
      setHasMoreBookmarks(!last && pageNum < totalPages - 1);
      setCurrentPage(pageNum);
    } catch (error) {
      toast.error('Failed to fetch bookmarked posts');
      console.error('Fetch bookmarks error:', error);
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  // Toggle bookmark status
  const toggleBookmark = useCallback(async (postId) => {
    try {
      const response = await axios.post(`${BOOKMARK_TOGGLE_URL}/${postId}/react/bookmark`, {}, {
        ...axiosConfig,
        headers: getAuthHeaders(),
      });

      // Update the bookmark status in the local state
      setBookmarks(prev => prev.map(bookmark => 
        bookmark.id === postId 
          ? { ...bookmark, bookmarked: response.data.bookmarked }
          : bookmark
      ));

      // If the post was unbookmarked, remove it from the list
      if (!response.data.bookmarked) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== postId));
        toast.success('Bookmark removed');
      } else {
        toast.success('Post bookmarked');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
      console.error('Toggle bookmark error:', error);
    }
  }, [getAuthHeaders]);

  // Load more bookmarks
  const loadMoreBookmarks = useCallback(() => {
    if (hasMoreBookmarks && !loading) {
      fetchBookmarks(currentPage + 1, true);
    }
  }, [hasMoreBookmarks, loading, currentPage, fetchBookmarks]);

  // Open post modal
  const openPostModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  // Close post modal
  const closePostModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  // Initial load
  useEffect(() => {
    fetchBookmarks(0, false);
  }, [fetchBookmarks]);

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Format expiry time
  const formatExpiryTime = (expiresAt, expiryDuration) => {
    if (expiryDuration === 'NEVER') return 'Never';
    if (!expiresAt) return 'Unknown';

    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffInMs = expiryDate - now;

    if (diffInMs <= 0) return 'Expired';

    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`;
  };

  // Get category styling
  const getCategoryStyle = (categories) => {
    const category = categories?.[0] || 'General';
    const categoryMap = {
      'Mental Health': { bg: 'bg-green-100', text: 'text-green-800' },
      'Relationships': { bg: 'bg-pink-100', text: 'text-pink-800' },
      'Career Stress': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Technology': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Personal': { bg: 'bg-orange-100', text: 'text-orange-800' },
      'General': { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    return categoryMap[category] || categoryMap['General'];
  };

  if (loading && bookmarks.length === 0) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookmarked posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <i className="fas fa-bookmark text-white text-xl"></i>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Bookmarked Posts</h2>
            <p className="text-gray-600 mb-6 text-lg">Curated collection of posts you've saved for later reading</p>
            {bookmarks.length > 0 && (
              <div className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full text-sm font-medium shadow-lg">
                <i className="fas fa-bookmark mr-2"></i>
                {bookmarks.length} bookmarked post{bookmarks.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {bookmarks.length === 0 && !loading ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                <i className="fas fa-bookmark text-gray-400 text-4xl"></i>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">No bookmarks yet</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Start exploring and bookmarking interesting posts to build your personal collection</p>
              <button
                onClick={() => window.location.href = '/feed'}
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <i className="fas fa-compass mr-3"></i>
                Discover Posts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((post) => {
                const categoryStyle = getCategoryStyle(post.categories);
                
                return (
                  <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 confession-card">
                    {/* Card Header */}
                    <div className="p-6 pb-4 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">{post.displayUsername}</h3>
                            <span className="text-xs text-gray-500">{formatRelativeTime(post.createdAt)}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(post.id);
                          }}
                          className="p-2 rounded-full bg-secondary hover:bg-secondary hover:bg-opacity-80 text-white hover:text-white transition-all duration-200 shadow-md"
                          title="Remove bookmark"
                        >
                          <i className="fas fa-bookmark text-lg"></i>
                        </button>
                      </div>
                      
                      <span className={`inline-block px-3 py-1 ${categoryStyle.bg} ${categoryStyle.text} text-xs rounded-full font-medium`}>
                        {post.categories?.[0] || 'General'}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 pt-4 cursor-pointer" onClick={() => openPostModal(post)}>
                      {post.title && (
                        <h4 className="font-bold text-gray-800 mb-3 line-clamp-2 text-lg hover:text-primary transition-colors duration-200">
                          {post.title}
                        </h4>
                      )}

                      {post.generatedTitle && !post.title && (
                        <h4 className="font-semibold text-gray-700 mb-3 line-clamp-2 italic text-lg hover:text-primary transition-colors duration-200">
                          {post.generatedTitle}
                        </h4>
                      )}

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.content}</p>

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.hashtags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full font-medium">
                              #{tag}
                            </span>
                          ))}
                          {post.hashtags.length > 3 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              +{post.hashtags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-4 py-3 bg-gray-50 rounded-lg px-3">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <i className="far fa-heart mr-1 text-red-500"></i>
                            <span className="text-gray-700">{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="far fa-comment mr-1 text-primary"></i>
                            <span className="text-gray-700">{post.comments || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <i className="fas fa-hands-helping mr-1 text-secondary"></i>
                            <span className="text-gray-700">{post.supports || 0}</span>
                          </div>
                        </div>
                        {post.trendingScore && (
                          <div className="flex items-center bg-tertiary bg-opacity-20 px-2 py-1 rounded-full">
                            <i className="fas fa-fire mr-1 text-tertiary"></i>
                            <span className="font-medium text-gray-700">{Math.round(post.trendingScore)}</span>
                          </div>
                        )}
                      </div>

                      {/* Expiry Info */}
                      <div className="text-xs text-gray-400 mb-4 flex justify-between items-center">
                        <span>
                          Expires: {formatExpiryTime(post.expiresAt, post.expiryDuration)}
                        </span>
                        {post.expired && (
                          <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            Expired
                          </span>
                        )}
                      </div>

                      {/* Read Button - Following your project's button style */}
                      <button className="w-full bg-primary hover:bg-opacity-90 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 custom-shadow">
                        <i className="fas fa-book-open"></i>
                        <span>Read Full Post</span>
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More Button */}
          {hasMoreBookmarks && bookmarks.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={loadMoreBookmarks}
                disabled={loading}
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-3"></i>
                    Loading More...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus-circle mr-3"></i>
                    Load More Bookmarks
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Post Reading Modal */}
      {isModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  <i className="fas fa-user"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <span className="text-lg font-semibold text-gray-800">{selectedPost.displayUsername}</span>
                    <span className={`inline-block px-3 py-1 ${getCategoryStyle(selectedPost.categories).bg} ${getCategoryStyle(selectedPost.categories).text} text-xs rounded-full font-medium`}>
                      {selectedPost.categories?.[0] || 'General'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{formatRelativeTime(selectedPost.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleBookmark(selectedPost.id)}
                  className="p-3 rounded-full bg-secondary bg-opacity-20 text-secondary hover:bg-opacity-30 transition-all duration-200"
                  title="Toggle bookmark"
                >
                  <i className="fas fa-bookmark text-xl"></i>
                </button>
                <button
                  onClick={closePostModal}
                  className="p-3 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-200"
                  title="Close"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
              {selectedPost.title && (
                <h2 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">{selectedPost.title}</h2>
              )}
              
              {selectedPost.generatedTitle && !selectedPost.title && (
                <h2 className="text-2xl font-semibold text-gray-700 mb-6 italic leading-tight">{selectedPost.generatedTitle}</h2>
              )}
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg mb-8">
                  {selectedPost.content}
                </p>
              </div>

              {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-8 pt-6 border-t border-gray-100">
                  {selectedPost.hashtags.map((tag, index) => (
                    <span key={index} className="text-sm bg-primary bg-opacity-10 text-primary px-4 py-2 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Modal Footer Stats */}
              <div className="flex justify-between items-center pt-6 border-t border-gray-100 text-sm">
                <div className="flex space-x-6">
                  <div className="flex items-center bg-red-50 px-4 py-2 rounded-full">
                    <i className="far fa-heart mr-2 text-red-500"></i>
                    <span className="text-gray-700 font-medium">{selectedPost.likes || 0} likes</span>
                  </div>
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full">
                    <i className="far fa-comment mr-2 text-primary"></i>
                    <span className="text-gray-700 font-medium">{selectedPost.comments || 0} comments</span>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full">
                    <i className="fas fa-hands-helping mr-2 text-secondary"></i>
                    <span className="text-gray-700 font-medium">{selectedPost.supports || 0} supports</span>
                  </div>
                  {selectedPost.trendingScore && (
                    <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full">
                      <i className="fas fa-fire mr-2 text-tertiary"></i>
                      <span className="text-gray-700 font-medium">{Math.round(selectedPost.trendingScore)} trending</span>
                    </div>
                  )}
                </div>
                <div className="text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                  Expires: {formatExpiryTime(selectedPost.expiresAt, selectedPost.expiryDuration)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Bookmarks;