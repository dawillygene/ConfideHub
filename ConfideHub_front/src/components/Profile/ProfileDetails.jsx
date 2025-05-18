import React, { useState } from 'react';
import './ProfileDetails.css';

const ProfileDetails = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);

  const posts = [
    {
      id: 'post-1',
      title: 'Getting Started with ConfideHubs',
      content: 'In this post, I share my experience as a new user on the ConfideHubs platform and provide tips for newcomers...',
      date: 'May 12, 2023',
      comments: 8,
      likes: 24,
      status: 'published'
    },
    {
      id: 'post-2',
      title: 'Best Practices for Secure Communication',
      content: 'Security is paramount when communicating online. In this post, I discuss some important practices to keep your information safe...',
      date: 'April 28, 2023',
      comments: 15,
      likes: 37,
      status: 'published'
    },
    {
      id: 'post-3',
      title: 'Building Community Through Digital Spaces',
      content: 'Communities thrive when members feel connected. This post explores strategies for fostering genuine connections in digital environments...',
      date: 'April 10, 2023',
      comments: 21,
      likes: 52,
      status: 'published'
    },
    {
      id: 'post-4',
      title: 'My Journey in Software Development',
      content: 'From beginner to professional - here\'s my personal journey through learning software development and the lessons I learned along the way...',
      date: 'March 22, 2023',
      comments: 12,
      likes: 31,
      status: 'published'
    },
    {
      id: 'post-5',
      title: 'Upcoming Features I\'d Love to See',
      content: 'My wishlist for future platform features and functionality improvements that would enhance the user experience...',
      date: 'Today',
      comments: 0,
      likes: 0,
      status: 'draft'
    }
  ];

  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  const deletePost = () => {
    // Handle post deletion here
    console.log('Deleting post:', postToDelete);
    closeDeleteModal();
  };

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.status === activeTab);

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - User Profile */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl overflow-hidden shadow-custom mb-6 profile-section">
              <div className="bg-primary h-32 relative">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="bg-white rounded-full p-2 shadow-lg">
                    <div className="bg-secondary h-24 w-24 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800" id="username">johndoe</h2>
                <p className="text-gray-600" id="email">john.doe@example.com</p>
                <div className="flex justify-center mt-4 mb-6 space-x-2">
                  <span id="role-badge" className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium">User</span>
                </div>
                <button className="btn-primary rounded-lg px-6 py-3 font-medium text-white w-full mb-3">
                  <i className="fas fa-pen mr-2"></i>Edit Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-custom mb-6 profile-section">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-chart-bar text-primary mr-2"></i>Account Statistics
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">Jan 15, 2023</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Posts</span>
                    <span className="font-medium" id="post-count">12</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Comments</span>
                    <span className="font-medium">48</span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reputation</span>
                    <span className="font-medium">157</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-custom profile-section">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <i className="fas fa-cog text-primary mr-2"></i>Quick Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={emailNotifications}
                        onChange={() => setEmailNotifications(!emailNotifications)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Two-Factor Auth</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={twoFactorAuth}
                        onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Privacy Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={privacyMode}
                        onChange={() => setPrivacyMode(!privacyMode)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - User Posts */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-custom mb-6 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Posts</h2>
                <div className="flex space-x-4">
                  <button className="btn-accent rounded-lg px-4 py-2 flex items-center">
                    <i className="fas fa-plus mr-2"></i>New Post
                  </button>
                  <div className="relative">
                    <input type="text" placeholder="Search posts..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                    <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  </div>
                </div>
              </div>

              <div className="flex mb-4 border-b border-gray-200">
                <button 
                  className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'all' ? 'text-primary border-primary' : 'text-gray-500 border-transparent'}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Posts (12)
                </button>
                <button 
                  className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'published' ? 'text-primary border-primary' : 'text-gray-500 border-transparent'}`}
                  onClick={() => setActiveTab('published')}
                >
                  Published (10)
                </button>
                <button 
                  className={`px-4 py-2 font-medium border-b-2 ${activeTab === 'draft' ? 'text-primary border-primary' : 'text-gray-500 border-transparent'}`}
                  onClick={() => setActiveTab('draft')}
                >
                  Drafts (2)
                </button>
              </div>

              {/* Posts List */}
              <div className="space-y-6">
                {filteredPosts.map(post => (
                  <div key={post.id} className="border border-gray-200 rounded-xl p-5 post-card">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-primary">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-500" 
                          onClick={() => openDeleteModal(post.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4"><i className="fas fa-calendar-alt mr-1"></i> {post.date}</span>
                        <span className="mr-4"><i className="fas fa-comment mr-1"></i> {post.comments} comments</span>
                        <span><i className="fas fa-heart mr-1"></i> {post.likes} likes</span>
                      </div>
                      <span className={`${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} text-xs font-medium px-2.5 py-0.5 rounded`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="flex justify-center mt-8">
                  <button className="btn-primary rounded-lg px-8 py-3 font-medium">Load More Posts</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-800">Delete Post</h3>
              <p className="text-gray-600 mt-2">Are you sure you want to delete this post? This action cannot be undone.</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={closeDeleteModal} 
                className="w-1/2 py-3 bg-gray-200 rounded-lg font-medium text-gray-800 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={deletePost} 
                className="w-1/2 py-3 bg-red-500 rounded-lg font-medium text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDetails;