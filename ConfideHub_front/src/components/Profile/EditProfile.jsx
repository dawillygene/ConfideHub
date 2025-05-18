import React, { useState } from 'react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: 'johndoe',
    email: 'john.doe@example.com',
    fullname: 'John Doe',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    website: 'https://johndoe.com',
    bio: "I'm a software developer with a passion for web development and user experience design. I enjoy working on challenging projects and learning new technologies.",
    roles: ['user'],
    interests: ['tech', 'design'],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twitter: '@johndoe',
    linkedin: 'johndoe',
    github: 'johndoe',
    instagram: 'johndoe',
    privacyEmail: true,
    privacyPhone: false,
    privacyPosts: true,
    notifyPosts: true,
    notifyMessages: true,
    notifyFollowers: true,
    notifyNews: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => {
      const roles = [...prev.roles];
      if (roles.includes(role)) {
        return { ...prev, roles: roles.filter(r => r !== role) };
      } else {
        return { ...prev, roles: [...roles, role] };
      }
    });
  };

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm opacity-80">Update your personal information and profile settings</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Profile Picture */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="mb-6">
                <div className="relative w-40 h-40 mx-auto">
                  <img 
                    src="https://ui-avatars.com/api/?name=John+Doe&background=random" 
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover border-4 border-accent"
                  />
                  <div className="absolute bottom-0 right-0 bg-accent hover:bg-accent-dark text-white rounded-full p-2 cursor-pointer transition-all">
                    <i className="fas fa-camera"></i>
                  </div>
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm text-gray-500">Click the camera icon to upload a new profile picture</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, GIF or PNG. Max size 2MB</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-50 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-3">Profile Completion</h3>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Your profile is 75% complete</p>
                <ul className="mt-3 text-sm">
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>Basic information</span>
                  </li>
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    <span>Profile picture</span>
                  </li>
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className="fas fa-exclamation-circle text-yellow-500 mr-2"></i>
                    <span>Add a bio</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className="fas fa-times-circle text-red-500 mr-2"></i>
                    <span>Connect social accounts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Column - Form */}
            <div className="w-full md:w-2/3">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="col-span-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-user text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        value={formData.username}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Your unique username on ConfideHubs</p>
                  </div>
                  
                  {/* Email */}
                  <div className="col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </div>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">We'll never share your email with anyone else</p>
                  </div>
                  
                  {/* Full Name */}
                  <div className="col-span-1">
                    <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-id-card text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="fullname" 
                        name="fullname" 
                        value={formData.fullname}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="col-span-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-phone text-gray-400"></i>
                      </div>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="col-span-1">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-map-marker-alt text-gray-400"></i>
                      </div>
                      <input 
                        type="text" 
                        id="location" 
                        name="location" 
                        value={formData.location}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Website */}
                  <div className="col-span-1">
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="fas fa-globe text-gray-400"></i>
                      </div>
                      <input 
                        type="url" 
                        id="website" 
                        name="website" 
                        value={formData.website}
                        onChange={handleChange}
                        className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                      />
                    </div>
                  </div>
                  
                  {/* Bio */}
                  <div className="col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea 
                      id="bio" 
                      name="bio" 
                      rows="4" 
                      value={formData.bio}
                      onChange={handleChange}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">Brief description for your profile. Maximum 500 characters.</p>
                  </div>
                  
                  {/* Roles / Interests Section */}
                  <div className="col-span-2 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Roles & Interests</h3>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center">
                        <input 
                          id="role-user" 
                          type="checkbox" 
                          checked={formData.roles.includes('user')}
                          onChange={() => handleRoleChange('user')}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="role-user" className="ml-2 block text-sm text-gray-700">User</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="role-admin" 
                          type="checkbox" 
                          checked={formData.roles.includes('admin')}
                          onChange={() => handleRoleChange('admin')}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">Admin</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="role-moderator" 
                          type="checkbox" 
                          checked={formData.roles.includes('moderator')}
                          onChange={() => handleRoleChange('moderator')}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor="role-moderator" className="ml-2 block text-sm text-gray-700">Moderator</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="interest-tech" 
                          type="checkbox" 
                          checked={formData.interests.includes('tech')}
                          onChange={() => handleInterestChange('tech')}
                          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor="interest-tech" className="ml-2 block text-sm text-gray-700">Technology</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="interest-design" 
                          type="checkbox" 
                          checked={formData.interests.includes('design')}
                          onChange={() => handleInterestChange('design')}
                          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor="interest-design" className="ml-2 block text-sm text-gray-700">Design</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="interest-business" 
                          type="checkbox" 
                          checked={formData.interests.includes('business')}
                          onChange={() => handleInterestChange('business')}
                          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <label htmlFor="interest-business" className="ml-2 block text-sm text-gray-700">Business</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Password Section */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Current Password */}
                      <div>
                        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-lock text-gray-400"></i>
                          </div>
                          <input 
                            type="password" 
                            id="current-password" 
                            name="currentPassword" 
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      {/* New Password */}
                      <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-key text-gray-400"></i>
                          </div>
                          <input 
                            type="password" 
                            id="new-password" 
                            name="newPassword" 
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      {/* Confirm Password */}
                      <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-key text-gray-400"></i>
                          </div>
                          <input 
                            type="password" 
                            id="confirm-password" 
                            name="confirmPassword" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <p className="text-sm text-gray-500">Leave password fields empty if you don't want to change it</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Twitter */}
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-twitter text-blue-400"></i>
                          </div>
                          <input 
                            type="text" 
                            id="twitter" 
                            name="twitter" 
                            value={formData.twitter}
                            onChange={handleChange}
                            placeholder="@username" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      {/* LinkedIn */}
                      <div>
                        <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-linkedin-in text-blue-700"></i>
                          </div>
                          <input 
                            type="text" 
                            id="linkedin" 
                            name="linkedin" 
                            value={formData.linkedin}
                            onChange={handleChange}
                            placeholder="username" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      {/* GitHub */}
                      <div>
                        <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-github text-gray-800"></i>
                          </div>
                          <input 
                            type="text" 
                            id="github" 
                            name="github" 
                            value={formData.github}
                            onChange={handleChange}
                            placeholder="username" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                      
                      {/* Instagram */}
                      <div>
                        <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-instagram text-pink-600"></i>
                          </div>
                          <input 
                            type="text" 
                            id="instagram" 
                            name="instagram" 
                            value={formData.instagram}
                            onChange={handleChange}
                            placeholder="username" 
                            className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Privacy Settings */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Privacy Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="privacy-email" 
                            name="privacyEmail" 
                            type="checkbox" 
                            checked={formData.privacyEmail}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="privacy-email" className="font-medium text-gray-700">Show email address on profile</label>
                          <p className="text-gray-500">Allow other users to see your email address</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="privacy-phone" 
                            name="privacyPhone" 
                            type="checkbox" 
                            checked={formData.privacyPhone}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="privacy-phone" className="font-medium text-gray-700">Show phone number on profile</label>
                          <p className="text-gray-500">Allow other users to see your phone number</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="privacy-posts" 
                            name="privacyPosts" 
                            type="checkbox" 
                            checked={formData.privacyPosts}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="privacy-posts" className="font-medium text-gray-700">Make posts public</label>
                          <p className="text-gray-500">Allow your posts to be viewed by non-registered users</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notification Preferences */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Notification Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="notify-posts" 
                            name="notifyPosts" 
                            type="checkbox" 
                            checked={formData.notifyPosts}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notify-posts" className="font-medium text-gray-700">Post interactions</label>
                          <p className="text-gray-500">Likes, comments, shares on your posts</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="notify-messages" 
                            name="notifyMessages" 
                            type="checkbox" 
                            checked={formData.notifyMessages}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notify-messages" className="font-medium text-gray-700">Direct messages</label>
                          <p className="text-gray-500">When someone sends you a message</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="notify-followers" 
                            name="notifyFollowers" 
                            type="checkbox" 
                            checked={formData.notifyFollowers}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notify-followers" className="font-medium text-gray-700">New followers</label>
                          <p className="text-gray-500">When someone follows your profile</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input 
                            id="notify-news" 
                            name="notifyNews" 
                            type="checkbox" 
                            checked={formData.notifyNews}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="notify-news" className="font-medium text-gray-700">News & updates</label>
                          <p className="text-gray-500">Platform news and feature updates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Submit Buttons */}
                  <div className="col-span-2 flex justify-end space-x-4 border-t border-gray-200 pt-6 mt-6">
                    <button 
                      type="button" 
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete Account
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;