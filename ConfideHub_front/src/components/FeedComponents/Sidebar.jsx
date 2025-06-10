import { useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../Context/AppProvider';

const CATEGORIES = [
  {
    name: 'Mental Health',
    icon: 'fa-heart',
    color: 'purple',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-500',
    description: 'Support for mental wellness',
    path: '/feed?category=Mental Health'
  },
  {
    name: 'Relationships',
    icon: 'fa-users',
    color: 'pink',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-500',
    description: 'Love, friendship, and connections',
    path: '/feed?category=Relationships'
  },
  {
    name: 'Career Stress',
    icon: 'fa-briefcase',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-500',
    description: 'Work and professional challenges',
    path: '/feed?category=Career Stress'
  },
  {
    name: 'Family Issues',
    icon: 'fa-home',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-500',
    description: 'Family dynamics and support',
    path: '/feed?category=Family Issues'
  },
  {
    name: 'Unknown+ Space',
    icon: 'fa-rainbow',
    color: 'indigo',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-500',
    description: 'Safe space for all topics',
    path: '/feed?category=Unknown+ Space'
  },
];

const QUICK_ACTIONS = [
  {
    name: 'Create Post',
    icon: 'fa-plus',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-500',
    path: '/feed',
    action: 'create-post'
  },
  {
    name: 'Your Posts',
    icon: 'fa-file-alt',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500',
    path: '/profile/posts'
  },
  {
    name: 'Bookmarks',
    icon: 'fa-bookmark',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-500',
    path: '/bookmarks'
  }
];

const Sidebar = ({ onCategoryChange, onCreatePost }) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category.name);
    if (onCategoryChange) {
      onCategoryChange(category.name);
    } else {
      navigate(category.path);
    }
  }, [onCategoryChange, navigate]);

  const handleQuickAction = useCallback((action) => {
    if (action.action === 'create-post' && onCreatePost) {
      onCreatePost();
    } else {
      navigate(action.path);
    }
  }, [onCreatePost, navigate]);

  return (
    <div className="sidebar w-1/4 mr-4 hidden md:block">
      <div className="sticky top-20 space-y-4">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
              {user ? user.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Welcome back!</h3>
              <p className="text-sm text-gray-600">{user || 'Guest'}</p>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="w-full bg-primary text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-block text-center"
          >
            View Profile
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.name}
                onClick={() => handleQuickAction(action)}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-8 h-8 ${action.bgColor} rounded-full flex items-center justify-center`}>
                  <i className={`fas ${action.icon} ${action.textColor} text-sm`}></i>
                </div>
                <span className="font-medium text-gray-700 text-sm">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Browse Categories</h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-left hover:shadow-sm ${
                  activeCategory === category.name 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 ${category.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <i className={`fas ${category.icon} ${category.textColor}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500 truncate">{category.description}</div>
                </div>
                {activeCategory === category.name && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Crisis Support */}
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
          <div className="flex items-center space-x-2 mb-3">
            <i className="fas fa-exclamation-triangle text-red-500"></i>
            <h3 className="font-bold text-red-700">Need Help?</h3>
          </div>
          <div className="space-y-2 mb-3">
            <div className="bg-red-50 p-2 rounded text-xs">
              <p className="text-red-700 font-medium">Crisis Support Hotline</p>
              <p className="text-red-600">1-800-273-8255</p>
            </div>
            <div className="bg-blue-50 p-2 rounded text-xs">
              <p className="text-blue-700 font-medium">Tanzania Crisis Line</p>
              <p className="text-blue-600">+255 22 2150302</p>
            </div>
          </div>
          <Link
            to="/resources"
            className="w-full bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium inline-block text-center"
          >
            <i className="fas fa-hands-helping mr-2"></i>
            Get Support
          </Link>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Community Guidelines</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
              <span>Share thoughts safely and anonymously</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
              <span>Be respectful and supportive</span>
            </div>
            <div className="flex items-start space-x-2">
              <i className="fas fa-check-circle text-green-500 mt-0.5"></i>
              <span>Protect privacy and others</span>
            </div>
          </div>
          <button className="w-full mt-3 text-blue-500 font-medium hover:underline text-xs">
            Read Full Guidelines
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;