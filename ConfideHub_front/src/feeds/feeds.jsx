import './feeds.css';
import { useState, useCallback, useMemo, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Sidebar from '../components/FeedComponents/Sidebar';
import RightSidebar from '../components/FeedComponents/RightSidebar';
import CreatePostSection from '../components/FeedComponents/CreatePostSection';
import PostModal from '../components/FeedComponents/PostModal';
import FilterSection from '../components/FeedComponents/FilterSection';
import PostList from '../components/FeedComponents/PostList';
import StatusBar from '../components/FeedComponents/HorizontalNav';
import { AppContext } from '../Context/AppProvider';

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
    sortBy: 'trending',
  });
  const [isPosting, setIsPosting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postData, setPostData] = useState({
    content: '',
    category: 'All',
    hashtags: [],
  });
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const observer = useRef();
  const { user } = useContext(AppContext);

  const extractHashtags = useCallback((text) => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map((tag) => tag.toLowerCase());
  }, []);

  const fetchPosts = useCallback(
    async (pageNum, append = false) => {
      setLoadingPosts(true);
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
        console.log(`[Feeds] Fetched page ${pageNum}, received ${content.length} posts:`, content.map(post => post.id));
        setPosts((prev) => {
          const newPosts = append ? [...prev, ...content] : content;
          // Deduplicate new posts based on ID before adding to state
          const uniqueNewPosts = newPosts.filter((newPost, index, self) =>
            index === self.findIndex((p) => p.id === newPost.id)
          );
          console.log('[Feeds] Current posts state (after deduplication):', uniqueNewPosts.map(post => post.id));
          return uniqueNewPosts;
        });
        setHasMorePosts(pageNum < totalPages - 1);
      } catch (error) {
        toast.error('Failed to fetch posts');
        console.error('Fetch posts error:', error);
      } finally {
        setLoadingPosts(false);
      }
    },
    [filter.sortBy]
  );



  useEffect(() => {
    setPage(0);
    setPosts([]);
    fetchPosts(0, false);
  }, [fetchPosts, filter.category, filter.searchQuery, filter.sortBy]);



  const lastPostElementRef = useCallback(
    (node) => {
      if (loadingPosts || !hasMorePosts) return;
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
    [loadingPosts, hasMorePosts, fetchPosts]
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
          username: isAnonymous ? `Anonymous_${Math.random().toString(36).substr(2, 4)}` : user || 'User',
          title: postData.content.substring(0, 50) + (postData.content.length > 50 ? '...' : ''),
          content: postData.content,
          categories: [postData.category],
          hashtags: hashtags,
          likes: 0,
          supports: 0,
          comments: 0,
          bookmarked: false,
        };
        const response = await axios.post(API_URL, newPostData, axiosConfig);
        console.log('[Feeds] Created new post:', response.data.id);
        setPosts((prev) => [response.data, ...prev]);
        setPostData({
          content: '',
          category: 'All',
          hashtags: [],
        });
        setIsModalOpen(false);
        toast.success('Post created successfully');
        //fetchRecommendations();  // Removed this line
      } catch (error) {
        toast.error('Failed to create post');
        console.error('Post creation error:', error);
      } finally {
        setIsPosting(false);
      }
    },
    [postData, isAnonymous, extractHashtags, user]
  );


  const handleReaction = useCallback(async (postId, type) => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/react/${type}`, null, axiosConfig);
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? response.data : post))
      );
   
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
      // Consider debouncing fetchRecommendations  // Removed this
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${type}`);
      console.error('Reaction error:', error);
    }
  }, []);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const filteredPosts = useMemo(() => {
    console.log('[Feeds] Computing filteredPosts, posts length:', posts.length, 'filter:', filter);
    let result = [...posts];

    if (filter.category !== 'All') {
      result = result.filter((post) => {
        const categories = Array.isArray(post.categories) ? post.categories : [];
        return categories.includes(filter.category);
      });
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.hashtags.some((tag) => tag.includes(query)) ||
          post.categories.some((cat) => cat.toLowerCase().includes(query))
      );
    }

    return result;
  }, [posts, filter]);

  const openPostModal = useCallback(() => {
    setIsModalOpen(true);
    setPostData({
      content: '',
      category: 'All',
      hashtags: [],
    });
  }, []);

  const handlePostDataChange = useCallback((e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return (
    <div className="container mx-auto px-4 py-4 mt-4 flex">
      <Sidebar />
      <div className="main-feed w-full md:w-2/4">
        <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-x-auto">
        <StatusBar />
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
          handlePostDataChange={handlePostDataChange}
        />
        <FilterSection filter={filter} handleFilterChange={handleFilterChange} />

        <PostList
          posts={filteredPosts}
          loading={loadingPosts}
          handleReaction={handleReaction}
          lastPostElementRef={lastPostElementRef}
        />
        {loadingPosts && hasMorePosts && (
          <div className="text-center py-4 text-gray-500">Loading more posts...</div>
        )}
        {!hasMorePosts && posts.length > 0 && (
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
