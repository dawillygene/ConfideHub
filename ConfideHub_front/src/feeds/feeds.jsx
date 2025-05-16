import './feeds.css';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Sidebar from '../components/FeedComponents/Sidebar';
import RightSidebar from '../components/FeedComponents/RightSidebar';
import CreatePostSection from '../components/FeedComponents/CreatePostSection';
import PostModal from '../components/FeedComponents/PostModal';
import FilterSection from '../components/FeedComponents/FilterSection';
import PostList from '../components/FeedComponents/PostList';

const CATEGORIES = [
  'All',
  'Mental Health',
  'Relationships',
  'Career Stress',
  'Family Issues',
  'Unknown+ Space',
];

const API_URL = 'http://localhost:8080/api/posts';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const Feeds = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({
    category: 'All',
    searchQuery: '',
    sortBy: 'trending', // Default to trending
  });
  const [isPosting, setIsPosting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState({
    content: '',
    category: 'All',
    hashtags: [],
    image: null,
  });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const fileInputRef = useRef(null);

  const extractHashtags = (text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map((tag) => tag.toLowerCase());
  };

  const fetchPosts = useCallback(async (pageNum, append = false) => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        ...axiosConfig,
        params: {
          page: pageNum,
          size: 10,
          sortBy: filter.sortBy,
        },
      });
      const { content, totalPages } = response.data;
      setPosts((prev) => (append ? [...prev, ...content] : content));
      setHasMore(pageNum < totalPages - 1);
    } catch (error) {
      toast.error('Failed to fetch posts');
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  }, [filter.sortBy]);

  useEffect(() => {
    // Reset posts and fetch first page when filter changes
    setPage(0);
    setPosts([]);
    fetchPosts(0, false);
  }, [fetchPosts, filter.category, filter.searchQuery, filter.sortBy]);

  // Infinite scroll observer
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchPosts(nextPage, true);
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPosts]
  );

  const handleCreatePost = useCallback(
    async (e) => {
      e.preventDefault();
      if (!postData.content.trim()) {
        toast.error('Post content cannot be empty');
        return;
      }
      setIsPosting(true);
      try {
        const hashtags = extractHashtags(postData.content);
        const newPostData = {
          username: isAnonymous ? `User_${Math.random().toString(36).substr(2, 4)}` : 'CurrentUser',
          title: postData.content.substring(0, 50) + (postData.content.length > 50 ? '...' : ''),
          content: postData.content,
          categories: [postData.category],
          hashtags: hashtags,
          likes: 0,
          supports: 0,
          comments: 0,
          bookmarked: false,
        };
        if (postData.image) {
          const formData = new FormData();
          formData.append('image', postData.image);
          formData.append('postData', JSON.stringify(newPostData));
        }
        const response = await axios.post(API_URL, newPostData, axiosConfig);
        setPosts((prev) => [response.data, ...prev]);
        setPostData({
          content: '',
          category: 'All',
          hashtags: [],
          image: null,
        });
        setIsModalOpen(false);
        toast.success('Post created successfully');
      } catch (error) {
        toast.error('Failed to create post');
        console.error('Post creation error:', error);
      } finally {
        setIsPosting(false);
      }
    },
    [postData, isAnonymous]
  );

  const handleReaction = useCallback(async (postId, type) => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/react/${type}`, null, axiosConfig);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${type}`);
      console.error('Reaction error:', error);
    }
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (filter.category !== 'All') {
      result = result.filter((post) => post.categories.includes(filter.category));
    }
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.hashtags.some((tag) => tag.includes(query))
      );
    }
    if (filter.sortBy === 'trending') {
      // Frontend sorting for trending: prioritize total reactions
      result.sort((a, b) => {
        const aReactions = a.likes + a.supports;
        const bReactions = b.likes + b.supports;
        if (aReactions !== bReactions) {
          return bReactions - aReactions; // Higher reactions first
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first
        });
    } else {
      // Already sorted by newest from backend
    }
    return result;
  }, [posts, filter]);

  const openPostModal = () => {
    setIsModalOpen(true);
    setPostData({
      content: '',
      category: 'All',
      hashtags: [],
      image: null,
    });
  };

  const handlePostDataChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="container mx-auto px-4 py-4 mt-4 flex">
      <Sidebar />
      <div className="main-feed w-full md:w-2/4">
        <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-x-auto">
          <div className="flex space-x-4">
            <div className="flex flex-col items-center">
              <div className="story-circle">
                <i className="fas fa-plus text-blue-500"></i>
              </div>
              <span className="text-xs mt-1">Create</span>
            </div>
            {CATEGORIES.slice(1).map((category) => (
              <div className="flex flex-col items-center" key={category}>
                <div className={`story-circle bg-${category === 'Mental Health' ? 'purple' : category === 'Relationships' ? 'pink' : category === 'Career Stress' ? 'green' : category === 'Family Issues' ? 'orange' : 'red'}-100`}>
                  <i className={`fas fa-${category === 'Mental Health' ? 'heart' : category === 'Relationships' ? 'users' : category === 'Career Stress' ? 'briefcase' : category === 'Family Issues' ? 'home' : 'rainbow'} text-${category === 'Mental Health' ? 'purple' : category === 'Relationships' ? 'pink' : category === 'Career Stress' ? 'green' : category === 'Family Issues' ? 'orange' : 'red'}-500`}></i>
                </div>
                <span className="text-xs mt-1">{category.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <CreatePostSection openPostModal={openPostModal} isAnonymous={isAnonymous} />
        <PostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          postData={postData}
          setPostData={setPostData}
          isAnonymous={isAnonymous}
          setIsAnonymous={setIsAnonymous}
          isPosting={isPosting}
          handleCreatePost={handleCreatePost}
          fileInputRef={fileInputRef}
          triggerFileInput={triggerFileInput}
          handleImageUpload={handleImageUpload}
          handlePostDataChange={handlePostDataChange}
        />
        <FilterSection filter={filter} handleFilterChange={handleFilterChange} />
        <PostList
          posts={filteredPosts}
          loading={loading}
          handleReaction={handleReaction}
          lastPostElementRef={lastPostElementRef}
        />
        {loading && hasMore && (
          <div className="text-center py-4 text-gray-500">Loading more posts...</div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-4 text-gray-500">No more posts to load</div>
        )}
        <div className="mt-8 bg-white rounded-lg shadow p-4 border-t-4 border-secondary md:hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Need Support?</h3>
          <p className="text-sm text-gray-600 mb-3">
            If you're experiencing a crisis or need immediate assistance, please reach out:
          </p>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
            View Support Resources
          </button>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default Feeds;