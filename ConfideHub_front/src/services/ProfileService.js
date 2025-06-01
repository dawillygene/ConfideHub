const API_BASE_URL = 'http://localhost:8080/api/profile';

class ProfileService {
  // Get authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(profileData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update profile: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file selected');
      }

      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPG, PNG, and GIF files are allowed');
      }

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/picture`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to upload profile picture: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete account: ${response.status} ${response.statusText}`);
      }

      // Clear local storage on successful deletion
      localStorage.removeItem('authToken');
      
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }
}

export default new ProfileService();