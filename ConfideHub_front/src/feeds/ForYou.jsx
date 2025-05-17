import React, { useState, useEffect, useCallback, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import PostList from '../components/FeedComponents/PostList';
import { AppContext } from '../Context/AppProvider';
import Sidebar from '../components/FeedComponents/Sidebar';
import RightSidebar from '../components/FeedComponents/RightSidebar';

const API_URL = 'http://localhost:8080/api/posts';
const RECOMMENDATION_API_URL = `${API_URL}/recommendations`;

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const ForYou = () => {
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const { user } = useContext(AppContext);

  const fetchRecommendations = useCallback(async () => {
    if (!user) {
      console.warn('[ForYou] User not logged in, skipping recommendation fetch.');
      return;
    }
    setLoadingRecommendations(true);
    try {
      const response = await axios.get(RECOMMENDATION_API_URL, axiosConfig);
      setRecommendedPosts(response.data);
      console.log('[ForYou] Fetched recommendations:', response.data.map(rec => rec.id));
    } catch (error) {
      toast.error('Failed to fetch recommendations');
      console.error('Fetch recommendations error:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  }, [user]);

    const handleReaction = useCallback(async (postId, type) => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/react/${type}`, null, axiosConfig);
      setRecommendedPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, likes: response.data.likes, supports: response.data.supports, comments: response.data.comments } : post
        )
      );
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to update ${type}`);
      console.error('Reaction error:', error);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="container mx-auto px-4 py-4 mt-4 flex">
      <Sidebar />
      <div className="main-feed w-full md:w-2/4">
        <div className="bg-white rounded-lg shadow p-4 mb-4 overflow-x-auto">
          {/* Story Circles could go here, if you have a component for that */}
        </div>
        {recommendedPosts.length > 0 ? (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Recommended For You</h2>
            {loadingRecommendations ? (
              <div className="text-center py-2 text-gray-500">Loading recommendations...</div>
            ) : (
              <PostList
                posts={recommendedPosts}
                loading={false}
                handleReaction={handleReaction}
                lastPostElementRef={() => {}}
              />
            )}
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            {user ? 'No recommendations available yet.' : 'Login to see recommendations.'}
          </div>
        )}
      </div>
      <RightSidebar />
    </div>
  );
};

export default ForYou;
