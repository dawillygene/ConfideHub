import React, { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppContext } from '../../Context/AppProvider';
import Sidebar from '../FeedComponents/Sidebar';
import RightSidebar from '../FeedComponents/RightSidebar';

const API_BASE_URL = 'http://localhost:8080/api/user/posts';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
];

const EXPIRY_OPTIONS = [
  { value: 'HOURS_24', label: '24 Hours' },
  { value: 'DAYS_7', label: '7 Days' },
  { value: 'NEVER', label: 'Forever' }
];

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const UserPosts = () => {
  const { user } = useContext(AppContext);
  const [posts, setPosts] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [filter, setFilter] = useState({
    includeExpired: false,
    category: 'All',
    searchQuery: '',
  });
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [postData, setPostData] = useState({
    title: '',
    content: '',
    categories: ['All'],
    hashtags: [],
    expiryDuration: 'HOURS_24',
  });

  // Get authorization header
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return {
      ...axiosConfig.headers,
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }, []);

  // Fetch user posts
  const fetchUserPosts = useCallback(async (pageNum = 0, append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(API_BASE_URL, {
        ...axiosConfig,
        headers: getAuthHeaders(),
        params: {
          page: pageNum,
          size: 10,
          includeExpired: filter.includeExpired,
        },
      });

      const { content, totalPages } = response.data;
      
      setPosts(prev => {
        const newPosts = append ? [...prev, ...content] : content;
        return newPosts.filter((post, index, self) =>
          index === self.findIndex(p => p.id === post.id)
        );
      });
      
      setHasMorePosts(pageNum < totalPages - 1);
    } catch (error) {
      toast.error('Failed to fetch your posts');
      console.error('Fetch user posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [filter.includeExpired, getAuthHeaders]);

  // Fetch user statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/statistics`, {
        ...axiosConfig,
        headers: getAuthHeaders(),
      });
      setStatistics(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    }
  }, [getAuthHeaders]);

  // Create new post
  const handleCreatePost = useCallback(async (e) => {
    e.preventDefault();
    if (!postData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: postData.title.trim() || undefined,
        content: postData.content.trim(),
        categories: postData.categories.filter(cat => cat !== 'All'),
        hashtags: postData.hashtags,
        expiryDuration: postData.expiryDuration
      };

      const response = await axios.post(API_BASE_URL, payload, {
        ...axiosConfig,
        headers: getAuthHeaders(),
      });

      setPosts(prev => [response.data, ...prev]);
      setIsModalOpen(false);
      resetPostData();
      toast.success('Post created successfully!');
      fetchStatistics(); // Refresh stats
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
      console.error('Create post error:', error);
    } finally {
      setLoading(false);
    }
  }, [postData, getAuthHeaders]);

  // Update post
  const handleUpdatePost = useCallback(async (e) => {
    e.preventDefault();
    if (!editingPost || !postData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: postData.title.trim() || undefined,
        content: postData.content.trim(),
        categories: postData.categories.filter(cat => cat !== 'All'),
        hashtags: postData.hashtags,
        expiryDuration: postData.expiryDuration
      };

      const response = await axios.put(`${API_BASE_URL}/${editingPost.id}`, payload, {
        ...axiosConfig,
        headers: getAuthHeaders(),
      });

      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? response.data : post
      ));
      
      setIsEditing(false);
      setEditingPost(null);
      setIsModalOpen(false);
      resetPostData();
      toast.success('Post updated successfully!');
      fetchStatistics(); // Refresh stats
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
      console.error('Update post error:', error);
    } finally {
      setLoading(false);
    }
  }, [postData, editingPost, getAuthHeaders]);

  // Delete post
  const handleDeletePost = useCallback(async () => {
    if (!postToDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/${postToDelete}`, {
        ...axiosConfig,
        headers: getAuthHeaders(),
      });

      setPosts(prev => prev.filter(post => post.id !== postToDelete));
      setDeleteConfirmOpen(false);
      setPostToDelete(null);
      toast.success('Post deleted successfully!');
      fetchStatistics(); // Refresh stats
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
      console.error('Delete post error:', error);
    }
  }, [postToDelete, getAuthHeaders]);

  // Utility functions
  const resetPostData = () => {
    setPostData({
      title: '',
      content: '',
      categories: ['All'],
      hashtags: [],
      expiryDuration: 'HOURS_24',
    });
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditingPost(null);
    resetPostData();
    setIsModalOpen(true);
  };

  const openEditModal = (post) => {
    setIsEditing(true);
    setEditingPost(post);
    setPostData({
      title: post.title || '',
      content: post.content,
      categories: post.categories.length > 0 ? post.categories : ['All'],
      hashtags: post.hashtags || [],
      expiryDuration: post.expiryDuration,
    });
    setIsModalOpen(true);
  };

  const openDeleteConfirm = (postId) => {
    setPostToDelete(postId);
    setDeleteConfirmOpen(true);
  };

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map(tag => tag.toLowerCase());
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    const hashtags = extractHashtags(content);
    setPostData(prev => ({
      ...prev,
      content,
      hashtags
    }));
  };

  const filteredPosts = posts.filter(post => {
    if (filter.category !== 'All' && !post.categories.includes(filter.category)) {
      return false;
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      return (
        post.title?.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.hashtags.some(tag => tag.includes(query))
      );
    }
    return true;
  });

  const loadMorePosts = () => {
    if (!loading && hasMorePosts) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserPosts(nextPage, true);
    }
  };

  // Effects
  useEffect(() => {
    fetchUserPosts(0, false);
    fetchStatistics();
  }, [fetchUserPosts, fetchStatistics]);

  useEffect(() => {
    setPage(0);
    fetchUserPosts(0, false);
  }, [filter.includeExpired]);

  return (
    <div className="container mx-auto px-4 py-4 mt-4 flex">
      <Sidebar />
      
      <div className="main-content w-full md:w-2/4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <Link 
            to="/profile" 
            className="hover:text-blue-600 transition-colors flex items-center"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Profile
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-800 font-medium">My Posts</span>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">My Posts</h1>
            <button
              onClick={openCreateModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              New Post
            </button>
          </div>

          {/* Statistics */}
          {statistics && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalPosts}</div>
                <div className="text-sm text-gray-600">Total Posts</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">{statistics.totalLikes}</div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.totalSupports}</div>
                <div className="text-sm text-gray-600">Total Supports</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{statistics.totalComments}</div>
                <div className="text-sm text-gray-600">Total Comments</div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search your posts..."
                value={filter.searchQuery}
                onChange={(e) => setFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filter.includeExpired}
                onChange={(e) => setFilter(prev => ({ ...prev, includeExpired: e.target.checked }))}
                className="mr-2"
              />
              Include Expired
            </label>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {post.generatedTitle || post.title || 'Untitled Post'}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <i className="fas fa-calendar mr-1"></i>
                    {new Date(post.createdAt).toLocaleDateString()}
                    {post.expiresAt && (
                      <>
                        <span className="mx-2">•</span>
                        <i className="fas fa-clock mr-1"></i>
                        {post.expired ? (
                          <span className="text-red-500">Expired</span>
                        ) : (
                          `Expires ${new Date(post.expiresAt).toLocaleDateString()}`
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit post"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => openDeleteConfirm(post.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                    title="Delete post"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>

              {/* Categories and Hashtags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.categories.map(category => (
                  <span key={category} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {category}
                  </span>
                ))}
                {post.hashtags.map(hashtag => (
                  <span key={hashtag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    #{hashtag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span><i className="fas fa-heart mr-1 text-red-500"></i>{post.likes}</span>
                <span><i className="fas fa-hands-helping mr-1 text-blue-500"></i>{post.supports}</span>
                <span><i className="fas fa-comment mr-1 text-gray-500"></i>{post.comments}</span>
                {post.bookmarked && <span><i className="fas fa-bookmark text-yellow-500"></i></span>}
              </div>
            </div>
          ))}

          {/* Load More Button */}
          {hasMorePosts && (
            <div className="text-center py-4">
              <button
                onClick={loadMorePosts}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}

          {/* No Posts Message */}
          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <i className="fas fa-pen-alt text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500 mb-4">
                {posts.length === 0 
                  ? "You haven't created any posts yet. Start sharing your thoughts!"
                  : "No posts match your current filters."
                }
              </p>
              {posts.length === 0 && (
                <button
                  onClick={openCreateModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Post Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {isEditing ? 'Edit Post' : 'Create New Post'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <form onSubmit={isEditing ? handleUpdatePost : handleCreatePost}>
                  {/* Title Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={postData.title}
                      onChange={(e) => setPostData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter a custom title (AI will generate one if left empty)"
                    />
                  </div>

                  {/* Content Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <textarea
                      value={postData.content}
                      onChange={handleContentChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="6"
                      placeholder="Share your thoughts... Use #hashtags to categorize your post."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hashtags will be automatically extracted from your content.
                    </p>
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter(cat => cat !== 'All').map(category => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={postData.categories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPostData(prev => ({
                                  ...prev,
                                  categories: [...prev.categories.filter(c => c !== 'All'), category]
                                }));
                              } else {
                                setPostData(prev => ({
                                  ...prev,
                                  categories: prev.categories.filter(c => c !== category)
                                }));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Expiry Duration */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Duration
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {EXPIRY_OPTIONS.map(option => (
                        <label
                          key={option.value}
                          className={`cursor-pointer rounded-lg border p-3 text-center transition-all ${
                            postData.expiryDuration === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="expiryDuration"
                            value={option.value}
                            checked={postData.expiryDuration === option.value}
                            onChange={(e) => setPostData(prev => ({ ...prev, expiryDuration: e.target.value }))}
                            className="sr-only"
                          />
                          <div className="text-sm font-medium">{option.label}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="text-center">
                  <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Post</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeletePost}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RightSidebar />
    </div>
  );
};

export default UserPosts;