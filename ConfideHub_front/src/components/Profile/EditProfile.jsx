import React, { useState, useEffect, useRef } from 'react';
import ProfileService from '../../services/ProfileService';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    interests: [],
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twitter: '',
    linkedin: '',
    github: '',
    instagram: '',
    privacyEmail: true,
    privacyPhone: false,
    privacyPosts: true,
    notifyPosts: true,
    notifyMessages: true,
    notifyFollowers: true,
    notifyNews: false,
    profilePictureUrl: '',
    profileCompletionPercentage: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // Load profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await ProfileService.getProfile();
        setFormData(prevData => ({
          ...prevData,
          ...profileData,
          // Ensure all string fields have default empty string values to prevent null errors
          username: profileData.username || '',
          email: profileData.email || '',
          fullname: profileData.fullname || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          website: profileData.website || '',
          bio: profileData.bio || '',
          twitter: profileData.twitter || '',
          linkedin: profileData.linkedin || '',
          github: profileData.github || '',
          instagram: profileData.instagram || '',
          profilePictureUrl: profileData.profilePictureUrl || '',
          interests: profileData.interests || [],
          // Ensure passwords are empty
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setError('');
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear messages when user starts typing
    if (error || success) {
      setError('');
      setSuccess('');
    }
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

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      
      const result = await ProfileService.uploadProfilePicture(file);
      
      setFormData(prev => ({
        ...prev,
        profilePictureUrl: result.url
      }));
      
      setSuccess('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setError(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }

    // Password validation (only if changing password)
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Current password is required to change password');
        return false;
      }
      
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return false;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New password and confirmation do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Prepare data for API (exclude confirmPassword and other UI-only fields)
      const { confirmPassword, profileCompletionPercentage, ...apiData } = formData;
      
      const updatedProfile = await ProfileService.updateProfile(apiData);
      
      // Update form data with response (including updated completion percentage)
      setFormData(prev => ({
        ...prev,
        ...updatedProfile,
        // Clear password fields after successful update
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      
      await ProfileService.deleteAccount();
      
      // Redirect to login or home page after successful deletion
      window.location.href = '/auth';
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setError(error.message || 'Failed to delete account. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm opacity-80">Update your personal information and profile settings</p>
        </div>
        
        {/* Success/Error Messages */}
        {(error || success) && (
          <div className="p-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <i className="fas fa-exclamation-circle mr-2"></i>
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <i className="fas fa-check-circle mr-2"></i>
                {success}
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Profile Picture */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="mb-6">
                <div className="relative w-40 h-40 mx-auto">
                  <img 
                    src={formData.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullname || formData.username)}&background=random`}
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover border-4 border-accent"
                  />
                  <div 
                    className={`absolute bottom-0 right-0 bg-accent hover:bg-accent-dark text-white rounded-full p-2 cursor-pointer transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleProfilePictureClick}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <i className="fas fa-camera"></i>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={uploading}
                  />
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
                    className="bg-accent h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${formData.profileCompletionPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Your profile is {formData.profileCompletionPercentage}% complete</p>
                <ul className="mt-3 text-sm">
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className={`fas ${formData.username && formData.email ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} mr-2`}></i>
                    <span>Basic information</span>
                  </li>
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className={`fas ${formData.profilePictureUrl ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} mr-2`}></i>
                    <span>Profile picture</span>
                  </li>
                  <li className="flex items-center text-gray-600 mb-2">
                    <i className={`fas ${formData.bio ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-yellow-500'} mr-2`}></i>
                    <span>Add a bio</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <i className={`fas ${formData.twitter || formData.linkedin || formData.github || formData.instagram ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} mr-2`}></i>
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
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
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
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Your unique username on ConfideHubs</p>
                  </div>
                  
                  {/* Email */}
                  <div className="col-span-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
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
                        required
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
                      maxLength="500"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">Brief description for your profile. {formData.bio.length}/500 characters.</p>
                  </div>

                  {/* Social Media Links */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Twitter */}
                      <div>
                        <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fab fa-twitter text-gray-400"></i>
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
                            <i className="fab fa-linkedin text-gray-400"></i>
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
                            <i className="fab fa-github text-gray-400"></i>
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
                            <i className="fab fa-instagram text-gray-400"></i>
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
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Make email public</span>
                          <p className="text-xs text-gray-500">Allow others to see your email address</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="privacyEmail" 
                            checked={formData.privacyEmail}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Make phone public</span>
                          <p className="text-xs text-gray-500">Allow others to see your phone number</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="privacyPhone" 
                            checked={formData.privacyPhone}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Public posts</span>
                          <p className="text-xs text-gray-500">Allow others to see your posts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="privacyPosts" 
                            checked={formData.privacyPosts}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div className="col-span-2 border-t border-gray-200 pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Post notifications</span>
                          <p className="text-xs text-gray-500">Get notified about new posts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="notifyPosts" 
                            checked={formData.notifyPosts}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Message notifications</span>
                          <p className="text-xs text-gray-500">Get notified about new messages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="notifyMessages" 
                            checked={formData.notifyMessages}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Follower notifications</span>
                          <p className="text-xs text-gray-500">Get notified about new followers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="notifyFollowers" 
                            checked={formData.notifyFollowers}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Newsletter</span>
                          <p className="text-xs text-gray-500">Receive news and updates</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name="notifyNews" 
                            checked={formData.notifyNews}
                            onChange={handleChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
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
                  
                  <div className="col-span-2 flex justify-end space-x-4 border-t border-gray-200 pt-6 mt-6">
                    <button 
                      type="button" 
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      disabled={saving}
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Deleting...
                        </>
                      ) : (
                        'Delete Account'
                      )}
                    </button>
                    <button 
                      type="submit" 
                      className="bg-primary py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
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