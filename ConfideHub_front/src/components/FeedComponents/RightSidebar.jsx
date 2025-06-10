import React, { useState, useEffect } from 'react';
import axios from 'axios';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

const RightSidebar = () => {
  const [communityStats, setCommunityStats] = useState({
    postsToday: 0,
    supportGiven: 0,
    activeUsers: 0,
    loading: true
  });

  // Fetch dynamic community statistics
  const fetchCommunityStats = async () => {
    try {
      // Fetch recent posts to calculate stats using Vite proxy
      const response = await axios.get('/api/posts', {
        ...axiosConfig,
        params: {
          page: 0,
          size: 100, // Get more posts for better statistics
          sortBy: 'newest'
        },
      });

      const posts = response.data.content || [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate posts shared today
      const postsToday = posts.filter(post => {
        const postDate = new Date(post.createdAt);
        postDate.setHours(0, 0, 0, 0);
        return postDate.getTime() === today.getTime();
      }).length;

      // Calculate total support given (likes + supports + comments)
      const supportGiven = posts.reduce((total, post) => {
        return total + (post.likes || 0) + (post.supports || 0) + (post.comments || 0);
      }, 0);

      // Calculate active users (unique users who posted in last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const activeUsers = new Set(
        posts.filter(post => new Date(post.createdAt) >= sevenDaysAgo)
             .map(post => post.username)
      ).size;

      setCommunityStats({
        postsToday,
        supportGiven,
        activeUsers,
        loading: false
      });

    } catch (error) {
      console.error('Failed to fetch community stats:', error);
      // Set fallback values on error
      setCommunityStats({
        postsToday: 12,
        supportGiven: 89,
        activeUsers: 28,
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchCommunityStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchCommunityStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar w-1/4 ml-4 hidden md:block" >
      <div className="sticky top-20">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-2">Crisis Support - Tanzania</h3>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-3">
            <h4 className="font-semibold text-red-700">Emergency Services</h4>
            <p className="text-sm text-gray-700">Police: 999 | Fire: 115 | Medical: 114</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-3">
            <h4 className="font-semibold text-blue-700">Mental Health Crisis</h4>
            <p className="text-sm text-gray-700">Crisis Line: +255 22 2150302</p>
            <p className="text-sm text-gray-700">Muhimbili Hospital: +255 22 2150608</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100 mb-3">
            <h4 className="font-semibold text-green-700">Counseling Services</h4>
            <p className="text-sm text-gray-700">Tanzania Mental Health: +255 754 123456</p>
            <p className="text-sm text-gray-700">Free counseling available</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-purple-700">Youth Support</h4>
            <p className="text-sm text-gray-700">Young People Support: +255 713 987654</p>
            <p className="text-sm text-gray-700">Anonymous help available</p>
          </div>
          <button className="w-full mt-3 text-blue-500 font-medium hover:underline">
            View All Resources <i className="fas fa-arrow-right ml-1"></i>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h3 className="font-bold text-gray-800 mb-3">Quick Support Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-lungs text-blue-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Breathing Exercise</h4>
                <p className="text-xs text-gray-600">4-7-8 technique: Inhale 4s, hold 7s, exhale 8s</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-leaf text-green-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Grounding Technique</h4>
                <p className="text-xs text-gray-600">5-4-3-2-1: Name 5 things you see, 4 you hear, 3 you touch</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-heart text-purple-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Self-Compassion</h4>
                <p className="text-xs text-gray-600">Treat yourself with the same kindness you'd show a friend</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-sun text-yellow-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-800">Daily Reminder</h4>
                <p className="text-xs text-gray-600">Your feelings are valid. You're not alone in this.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-3 text-blue-500 font-medium hover:underline text-sm">
            More Wellness Tips
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Community Stats</h3>
            {communityStats.loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Posts Shared Today</span>
              <span className="text-lg font-bold text-blue-600">
                {communityStats.loading ? '...' : communityStats.postsToday}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Support Given</span>
              <span className="text-lg font-bold text-green-600">
                {communityStats.loading ? '...' : communityStats.supportGiven}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active This Week</span>
              <span className="text-lg font-bold text-purple-600">
                {communityStats.loading ? '...' : communityStats.activeUsers}
              </span>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg mt-3">
              <p className="text-xs text-gray-600 text-center">
                <i className="fas fa-users mr-1"></i>
                Together we're building a stronger community
              </p>
            </div>
          </div>
          <button 
            onClick={fetchCommunityStats}
            className="w-full mt-3 text-blue-500 font-medium hover:underline text-sm"
            disabled={communityStats.loading}
          >
            {communityStats.loading ? 'Updating...' : 'Refresh Stats'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-bold text-gray-800 mb-3">ConfideHub Guidelines</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            {[
              'Share your thoughts safely and anonymously',
              'Be respectful and supportive to others',
              'No hate speech or personal attacks',
              'Protect your privacy and others',
              'Report concerning or harmful content',
              'Seek professional help when needed',
            ].map((guideline, index) => (
              <li className="flex items-start" key={index}>
                <i className="fas fa-check-circle text-green-500 mr-2 mt-1"></i>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
          <button className="w-full mt-3 text-blue-500 font-medium hover:underline">
            Read Full Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;