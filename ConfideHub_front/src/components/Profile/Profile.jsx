import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProfileDetails from './ProfileDetails'
import EditProfile from './EditProfile';
import Sidebar from '../FeedComponents/Sidebar';
import RightSidebar from '../FeedComponents/RightSidebar';

const Profile = () => {
  const location = useLocation();
  const isPostsPage = location.pathname.includes('/posts');

  return (
    <>
      <div className="container mx-auto px-4 py-4 mt-4 flex">
        <Sidebar />
        
        <div className="main-content w-full md:w-2/4">
          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="flex border-b">
              <Link
                to="/profile"
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  !isPostsPage
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-user mr-2"></i>
                Profile Settings
              </Link>
              <Link
                to="/profile/posts"
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  isPostsPage
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <i className="fas fa-pen-alt mr-2"></i>
                My Posts
              </Link>
            </div>
          </div>

          {/* Content based on current route */}
          {!isPostsPage && (
            <div className="space-y-6">
              {/* <ProfileDetails /> */}
              <EditProfile />
            </div>
          )}
        </div>

        <RightSidebar />
      </div>
    </>
  )
}

export default Profile