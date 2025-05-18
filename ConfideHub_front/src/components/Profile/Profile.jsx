import React from 'react'
import ProfileDetails from './ProfileDetails'
import EditProfile from './EditProfile';
import Sidebar from '../FeedComponents/Sidebar';

const Profile = () => {
  return (
  <>
   <div className="container mx-auto px-4 py-4 mt-4 flex">
   <Sidebar />
  {/* <ProfileDetails /> */}
  <EditProfile />
  </div>
  </>
  )
}

export default Profile