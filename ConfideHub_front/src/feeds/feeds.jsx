import './feeds.css';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
];

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({
    category: 'All',
    searchQuery: '',
    sortBy: 'newest',
  });
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);


  const API_URL = 'http://localhost:8080/api/posts';

  const axiosConfig = {
    withCredentials: true, 
    headers: {
      'Content-Type': 'application/json',
      
    },
  };

  // Fetch posts from backend
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, axiosConfig);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Create a new post
  const handleCreatePost = useCallback(async () => {
    if (!newPost.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsPosting(true);
    try {
      const newPostData = {
        username: isAnonymous ? `User_${Math.random().toString(36).substr(2, 4)}` : 'CurrentUser',
        title: newPost.substring(0, 50) + (newPost.length > 50 ? '...' : ''),
        content: newPost,
        categories: ['All'], // Could be enhanced with user selection
        hashtags: extractHashtags(newPost),
        likes: 0,
        supports: 0,
        comments: 0,
        bookmarked: false,
      };

      const response = await axios.post(API_URL, newPostData, axiosConfig);
      setPosts((prev) => [response.data, ...prev]);
      setNewPost('');
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Post creation error:', error);
    } finally {
      setIsPosting(false);
    }
  }, [newPost, isAnonymous]);

  // Handle reactions (like, support, bookmark)
  const handleReaction = useCallback(async (postId, type) => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/react/${type}`, null, axiosConfig);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
    } catch (error) {
      toast.error(`Failed to update ${type}`);
      console.error('Reaction error:', error);
    }
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  // Extract hashtags from text
  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map((tag) => tag.toLowerCase());
  };

  // Filtered and sorted posts (client-side)
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Apply category filter
    if (filter.category !== 'All') {
      result = result.filter((post) => post.categories.includes(filter.category));
    }

    // Apply search filter
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.hashtags.some((tag) => tag.includes(query))
      );
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'trending':
        result.sort((a, b) => b.likes + b.supports + b.comments - (a.likes + a.supports + a.comments));
        break;
      case 'mostSupported':
        result.sort((a, b) => b.supports - a.supports);
        break;
    }

    return result;
  }, [posts, filter]);

  return (
    <>
      <div className="container mx-auto px-4 py-4 mt-4 flex">
        <div className="sidebar w-1/4 mr-4 hidden md:block">
          <div className="sticky top-20">
            <div className="sidebar-item">
              <div className="sidebar-icon bg-blue-100">
                <i className="fas fa-user text-blue-500"></i>
              </div>
              <span className="font-medium">Your Profile</span>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon bg-purple-100">
                <i className="fas fa-heart text-purple-500"></i>
              </div>
              <span className="font-medium">Mental Health</span>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon bg-pink-100">
                <i className="fas fa-users text-pink-500"></i>
              </div>
              <span className="font-medium">Relationships</span>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon bg-green-100">
                <i className="fas fa-briefcase text-green-500"></i>
              </div>
              <span className="font-medium">Career Stress</span>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon bg-orange-100">
                <i className="fas fa-home text-orange-500"></i>
              </div>
              <span className="font-medium">Family Issues</span>
            </div>
            <div className="sidebar-item">
              <div className="sidebar-icon bg-red-100">
                <i className="fas fa-rainbow text-red-500"></i>
              </div>
              <span className="font-medium">Unknown+ Space</span>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-3">Crisis Support Hotline: 1-800-273-8255</p>
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Get Support
              </button>
            </div>
          </div>
        </div>

        <div className="main-feed w-full md:w-2/4">
          <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-x-auto">
            <div className="flex space-x-4">
              <div className="flex flex-col items-center">
                <div className="story-circle">
                  <i className="fas fa-plus text-blue-500"></i>
                </div>
                <span className="text-xs mt-1">Create</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="story-circle bg-purple-100">
                  <i className="fas fa-heart text-purple-500"></i>
                </div>
                <span className="text-xs mt-1">Mental</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="story-circle bg-pink-100">
                  <i className="fas fa-users text-pink-500"></i>
                </div>
                <span className="text-xs mt-1">Relationship</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="story-circle bg-green-100">
                  <i className="fas fa-briefcase text-green-500"></i>
                </div>
                <span className="text-xs mt-1">Career</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="story-circle bg-orange-100">
                  <i className="fas fa-home text-orange-500"></i>
                </div>
                <span className="text-xs mt-1">Family</span>
              </div>
            </div>
          </div>

          <div className="create-section mb-4">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <i className="fas fa-user text-gray-500"></i>
              </div>
              <div className="create-input w-full">
                <input
                  type="text"
                  placeholder="Share a confession..."
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  disabled={isPosting}
                />
              </div>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-around">
              <button
                className={`reaction-btn ${isAnonymous ? 'text-yellow-500' : ''}`}
                onClick={() => setIsAnonymous(!isAnonymous)}
              >
                <i className="fas fa-key mr-2"></i>
                <span>{isAnonymous ? 'Anonymous' : 'Public'}</span>
              </button>
              <button className="reaction-btn">
                <i className="fas fa-image text-green-500 mr-2"></i>
                <span>Photo</span>
              </button>
              <button
                className="reaction-btn"
                onClick={handleCreatePost}
                disabled={isPosting}
              >
                <i className={`fas fa-paper-plane ${isPosting ? 'text-gray-400' : 'text-purple-500'} mr-2`}></i>
                <span>{isPosting ? 'Posting...' : 'Share'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
              <div className="flex flex-wrap gap-2 mb-3 md:mb-0 overflow-x-auto pb-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    className={`btn-filter px-3 py-1 rounded-full text-sm font-medium border transition ${
                      filter.category === category
                        ? 'active'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handleFilterChange({ category })}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={filter.sortBy}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                  >
                    <option value="newest">Newest</option>
                    <option value="trending">Trending</option>
                    <option value="mostSupported">Most Supported</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <i className="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search confessions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                value={filter.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No posts found matching your criteria</div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={`post-card bg-white shadow rounded-lg overflow-hidden border-l-4 ${
                    post.categories.includes('Unknown+ Space')
                      ? 'border-primary'
                      : post.categories.includes('Mental Health')
                      ? 'border-tertiary'
                      : post.categories.includes('Career Stress')
                      ? 'border-secondary'
                      : post.categories.includes('Family Issues')
                      ? 'border-red-500'
                      : 'border-primary'
                  }`}
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
                          Expires in{' '}
                          {Math.ceil(
                            (new Date(post.expiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
                          )}{' '}
                          days
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.categories.map((category) => (
                        <span
                          key={category}
                          className={`category-pill ${
                            category === 'Unknown+ Space'
                              ? 'bg-pink-100 text-pink-700'
                              : category === 'Mental Health'
                              ? 'bg-blue-100 text-blue-700'
                              : category === 'Relationships'
                              ? 'bg-purple-100 text-purple-700'
                              : category === 'Career Stress'
                              ? 'bg-green-100 text-green-700'
                              : category === 'Family Issues'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
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
                        <button className="reaction-btn">
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
              ))
            )}

            <div className="mt-6 text-center">
              <button className="bg-blue-500 hover:bg-blue-700 text-white px- personally feel like this could be improved by adding some interactivity to the button, maybe a loading spinner or a subtle animation on hover to make it feel more responsive. 6 py-3 rounded-lg font-medium transition shadow-md hover:shadow-lg w-full md:w-auto">
                See More Confessions
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-lg shadow p-4 border-t-4 border-secondary md:hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Need Support?</h3>
            <p className="text-sm text-gray-600 mb-3">
              If you’re experiencing a crisis or need immediate assistance, please reach out:
            </p>
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              View Support Resources
            </button>
          </div>
        </div>

        <div className="sidebar w-1/4 ml-4 hidden md:block">
          <div className="sticky top-20">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-2">Crisis Support</h3>
              <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-3">
                <h4 className="font-semibold text-red-700">Crisis Support</h4>
                <p className="text-sm text-gray-700">24/7 Hotline: 1-800-273-8255</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
                <h4 className="font-semibold text-blue-700">Mental Health</h4>
                <p className="text-sm text-gray-700">Text HOME to 741741</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-700">Unknown+ Support</h4>
                <p className="text-sm text-gray-700">Call: 1-866-488-7386</p>
              </div>
              <button className="w-full mt-3 text-blue-500 font-medium hover:underline">
                View All Resources <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="font-bold text-gray-800 mb-3">Trending Topics</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">#Anxiety</span>
                  <span className="text-gray-500 text-xs ml-auto">24k posts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">#CareerChange</span>
                  <span className="text-gray-500 text-xs ml-auto">16k posts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">
                    #RelationshipAdvice
                  </span>
                  <span className="text-gray-500 text-xs ml-auto">12k posts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">#SelfCare</span>
                  <span className="text-gray-500 text-xs ml-auto">9k posts</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 hover:text-blue-500 cursor-pointer">#Parenting</span>
                  <span className="text-gray-500 text-xs ml-auto">7k posts</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-gray-800 mb-3">Community Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Be respectful and supportive</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Maintain anonymity for yourself and others</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>No hate speech or harassment</span>
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                  <span>Report concerning content</span>
                </li>
              </ul>
              <button className="w-full mt-3 text-blue-500 font-medium hover:underline">
                Read Full Guidelines
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feeds;