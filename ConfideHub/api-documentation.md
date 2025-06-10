# User Post Management API Documentation

## Base URL
All endpoints are prefixed with: `/api/user/posts`

## Authentication
All endpoints require valid JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get User's Posts
**GET** `/api/user/posts`

Retrieve a paginated list of posts created by the authenticated user.

**Query Parameters:**
- `page` (optional, default: 0) - Page number (0-based)
- `size` (optional, default: 10) - Number of posts per page
- `includeExpired` (optional, default: false) - Include expired posts

**Example Request:**
```http
GET /api/user/posts?page=0&size=5&includeExpired=false
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "content": [
    {
      "id": "uuid-string",
      "title": "My Post Title",
      "generatedTitle": "AI Generated Title",
      "content": "Post content here...",
      "categories": ["Technology", "Programming"],
      "hashtags": ["coding", "java", "spring"],
      "likes": 15,
      "supports": 8,
      "comments": 3,
      "bookmarked": false,
      "createdAt": "2025-06-09T10:30:00",
      "expiryDuration": "HOURS_24",
      "expiresAt": "2025-06-10T10:30:00",
      "trendingScore": 45.2,
      "displayUsername": "anonymous_user_123",
      "expired": false
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 5
  },
  "totalElements": 25,
  "totalPages": 5,
  "last": false,
  "first": true
}
```

### 2. Get Specific User Post
**GET** `/api/user/posts/{postId}`

Retrieve a specific post by ID that belongs to the authenticated user.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post

**Example Request:**
```http
GET /api/user/posts/abc123-def456-ghi789
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "id": "abc123-def456-ghi789",
  "title": "My Specific Post",
  "generatedTitle": "AI Generated Title",
  "content": "Detailed post content...",
  "categories": ["Personal"],
  "hashtags": ["thoughts", "life"],
  "likes": 5,
  "supports": 2,
  "comments": 1,
  "bookmarked": false,
  "createdAt": "2025-06-09T08:15:00",
  "expiryDuration": "NEVER",
  "expiresAt": null,
  "trendingScore": 12.5,
  "displayUsername": "anonymous_user_456",
  "expired": false
}
```

### 3. Create New Post
**POST** `/api/user/posts`

Create a new post for the authenticated user.

**Request Body:**
```json
{
  "title": "Optional Post Title",
  "content": "Your post content here. This is required.",
  "categories": ["Technology", "Programming"],
  "hashtags": ["coding", "java"],
  "expiryDuration": "HOURS_24"
}
```

**Field Descriptions:**
- `title` (optional) - Custom title for the post
- `content` (required) - The main content of the post
- `categories` (optional) - Array of category strings
- `hashtags` (optional) - Array of hashtag strings (without # symbol)
- `expiryDuration` (optional) - One of: "HOURS_24", "DAYS_7", "NEVER"

**Example Request:**
```http
POST /api/user/posts
Content-Type: application/json
Authorization: Bearer your_jwt_token

{
  "content": "Just learned about Spring Boot security!",
  "categories": ["Learning"],
  "hashtags": ["springboot", "security"],
  "expiryDuration": "DAYS_7"
}
```

**Response:**
```json
{
  "id": "new-post-uuid",
  "title": null,
  "generatedTitle": "Learning Spring Boot Security",
  "content": "Just learned about Spring Boot security!",
  "categories": ["Learning"],
  "hashtags": ["springboot", "security"],
  "likes": 0,
  "supports": 0,
  "comments": 0,
  "bookmarked": false,
  "createdAt": "2025-06-09T12:00:00",
  "expiryDuration": "DAYS_7",
  "expiresAt": "2025-06-16T12:00:00",
  "trendingScore": 0.0,
  "displayUsername": "anonymous_user_789",
  "expired": false
}
```

### 4. Update Post (Full Update)
**PUT** `/api/user/posts/{postId}`

Completely update a post that belongs to the authenticated user.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content for the post",
  "categories": ["Updated Category"],
  "hashtags": ["updated", "post"],
  "expiryDuration": "NEVER"
}
```

**Example Request:**
```http
PUT /api/user/posts/abc123-def456-ghi789
Content-Type: application/json
Authorization: Bearer your_jwt_token

{
  "content": "This is my updated post content with new insights!",
  "categories": ["Technology", "Insights"],
  "hashtags": ["tech", "learning", "insights"]
}
```

### 5. Partial Update Post
**PATCH** `/api/user/posts/{postId}`

Partially update a post - only provided fields will be updated.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post

**Request Body (partial):**
```json
{
  "content": "Only updating the content",
  "hashtags": ["new", "hashtags"]
}
```

**Example Request:**
```http
PATCH /api/user/posts/abc123-def456-ghi789
Content-Type: application/json
Authorization: Bearer your_jwt_token

{
  "categories": ["Updated Category Only"]
}
```

### 6. Delete Post
**DELETE** `/api/user/posts/{postId}`

Delete a post that belongs to the authenticated user.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post

**Example Request:**
```http
DELETE /api/user/posts/abc123-def456-ghi789
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

### 7. Get Post Count
**GET** `/api/user/posts/count`

Get the total number of posts created by the authenticated user.

**Example Request:**
```http
GET /api/user/posts/count
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "count": 42
}
```

### 8. Check Post Ownership
**GET** `/api/user/posts/{postId}/ownership`

Check if a specific post belongs to the authenticated user.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post

**Example Request:**
```http
GET /api/user/posts/abc123-def456-ghi789/ownership
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "isOwner": true
}
```

### 9. Get User Post Statistics
**GET** `/api/user/posts/statistics`

Get comprehensive statistics about the user's posts.

**Example Request:**
```http
GET /api/user/posts/statistics
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "totalPosts": 25,
  "totalLikes": 150,
  "totalSupports": 75,
  "totalComments": 45,
  "averageLikesPerPost": 6.0,
  "averageSupportsPerPost": 3.0,
  "averageCommentsPerPost": 1.8
}
```

---

# Bookmarks API Documentation

## Base URL
All bookmark endpoints are prefixed with: `/api/posts`

## Authentication
All endpoints require valid JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Get Bookmarked Posts
**GET** `/api/posts/bookmarks`

Retrieve a paginated list of posts that have been bookmarked by the authenticated user.

**Query Parameters:**
- `page` (optional, default: 0) - Page number (0-based)
- `size` (optional, default: 10) - Number of posts per page

**Example Request:**
```http
GET /api/posts/bookmarks?page=0&size=10
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "content": [
    {
      "id": "bookmarked-post-id-1",
      "title": "Interesting Post I Saved",
      "generatedTitle": "AI Generated Title",
      "content": "This is a post I found interesting and bookmarked...",
      "categories": ["Technology", "Programming"],
      "hashtags": ["bookmark", "saved", "interesting"],
      "likes": 25,
      "supports": 12,
      "comments": 8,
      "bookmarked": true,
      "createdAt": "2025-06-09T14:30:00",
      "expiryDuration": "DAYS_7",
      "expiresAt": "2025-06-16T14:30:00",
      "trendingScore": 78.5,
      "displayUsername": "anonymous_user_456",
      "expired": false
    },
    {
      "id": "bookmarked-post-id-2",
      "title": "Another Saved Post",
      "generatedTitle": "Another AI Title",
      "content": "Another post that I bookmarked for later reading...",
      "categories": ["Personal"],
      "hashtags": ["thoughts", "inspiration"],
      "likes": 18,
      "supports": 9,
      "comments": 4,
      "bookmarked": true,
      "createdAt": "2025-06-08T09:15:00",
      "expiryDuration": "NEVER",
      "expiresAt": null,
      "trendingScore": 45.2,
      "displayUsername": "anonymous_user_789",
      "expired": false
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10
  },
  "totalElements": 15,
  "totalPages": 2,
  "last": false,
  "first": true
}
```

### 2. Bookmark/Unbookmark a Post
**POST** `/api/posts/{postId}/react/bookmark`

Toggle the bookmark status of a specific post. If the post is not bookmarked, it will be bookmarked. If it's already bookmarked, it will be unbookmarked.

**Path Parameters:**
- `postId` (required) - The unique identifier of the post to bookmark/unbookmark

**Example Request:**
```http
POST /api/posts/abc123-def456-ghi789/react/bookmark
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "id": "abc123-def456-ghi789",
  "title": "Post Title",
  "generatedTitle": "AI Generated Title",
  "content": "Post content...",
  "categories": ["Technology"],
  "hashtags": ["example"],
  "likes": 15,
  "supports": 8,
  "comments": 3,
  "bookmarked": true,
  "createdAt": "2025-06-09T10:30:00",
  "expiryDuration": "HOURS_24",
  "expiresAt": "2025-06-10T10:30:00",
  "trendingScore": 45.2,
  "displayUsername": "anonymous_user_123",
  "expired": false
}
```

## Key Features

### Bookmarks vs User Posts
- **User Posts API** (`/api/user/posts`) - Manages posts **created by** the authenticated user
- **Bookmarks API** (`/api/posts/bookmarks`) - Retrieves posts **bookmarked by** the authenticated user

### Important Notes
1. **Cross-User Bookmarking**: Users can bookmark posts created by any user (including their own)
2. **Automatic Filtering**: Only non-expired posts are returned in bookmark listings
3. **Bookmark Status**: All posts in the bookmarks API have `"bookmarked": true`
4. **Real-time Updates**: Bookmark status is updated immediately when toggled

### Security Features
1. **Authentication Required**: All bookmark endpoints require valid JWT authentication
2. **User Isolation**: Users can only see their own bookmarked posts
3. **Privacy Protection**: Anonymous usernames are maintained for post authors

## Error Responses

### 401 Unauthorized
When authentication token is missing or invalid:
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 404 Not Found
When trying to bookmark a post that doesn't exist:
```json
{
  "error": "Not Found",
  "message": "Post not found"
}
```

### 400 Bad Request
When request is malformed:
```json
{
  "error": "Bad Request",
  "message": "Invalid post ID format"
}
```

## Example Usage Scenarios

### Getting All Bookmarked Posts
```javascript
const response = await fetch('/api/posts/bookmarks?page=0&size=20', {
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const bookmarkedPosts = await response.json();
```

### Bookmarking a Post
```javascript
const response = await fetch(`/api/posts/${postId}/react/bookmark`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const updatedPost = await response.json();
console.log('Bookmark status:', updatedPost.bookmarked);
```

### Removing a Bookmark
```javascript
// Same endpoint - it toggles the bookmark status
const response = await fetch(`/api/posts/${postId}/react/bookmark`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const updatedPost = await response.json();
// If it was bookmarked, it's now unbookmarked
```

---

# Complete API Overview

## Summary of Available APIs

| API Category | Base URL | Purpose | Key Features |
|--------------|----------|---------|--------------|
| **User Posts** | `/api/user/posts` | Manage your own posts | Full CRUD operations, statistics, ownership validation |
| **Bookmarks** | `/api/posts/bookmarks` | Manage saved posts | View bookmarked posts, toggle bookmark status |
| **General Posts** | `/api/posts` | Public post operations | View all posts, comments, reactions |

## Rate Limiting
- Maximum 100 requests per minute per user
- Maximum 10 posts created per hour per user
- Maximum 50 bookmark toggles per hour per user

## Notes
1. All timestamps are in ISO 8601 format (UTC)
2. Posts with `expiryDuration` of "NEVER" will not expire
3. Expired posts are automatically cleaned up by the system
4. AI-generated titles are created automatically when content is provided
5. Anonymous usernames are generated deterministically for each post
6. All operations are logged for security and auditing purposes

## Additional Security Requirements Needed:

### Identity Protection:
- Implement IP address masking/anonymization
- Add explicit policies against location tracking
- Use cryptographically secure anonymous username generation
- Implement zero-knowledge architecture where possible

### Secure Storage:
- Use cryptographic deletion methods (not just database removal)
- Implement secure key destruction for expired content
- Minimize or eliminate operation logging that could compromise anonymity
- Add explicit third-party data sharing prohibitions

### Documentation Updates:
- Add privacy policy section to API documentation
- Specify data retention and deletion policies
- Detail anonymization techniques used
- Clarify what data is logged and how it's protected

## Example Usage Scenarios

### Creating a Simple Post
```javascript
const response = await fetch('/api/user/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userToken
  },
  body: JSON.stringify({
    content: 'My first post using the API!',
    categories: ['General'],
    hashtags: ['first', 'api']
  })
});
```

### Getting User's Recent Posts
```javascript
const response = await fetch('/api/user/posts?page=0&size=10', {
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const posts = await response.json();
```

### Updating Post Content
```javascript
const response = await fetch(`/api/user/posts/${postId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + userToken
  },
  body: JSON.stringify({
    content: 'Updated content with new information!'
  })
});
```

### Getting All Bookmarked Posts
```javascript
const response = await fetch('/api/posts/bookmarks?page=0&size=20', {
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const bookmarkedPosts = await response.json();
```

### Bookmarking a Post
```javascript
const response = await fetch(`/api/posts/${postId}/react/bookmark`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const updatedPost = await response.json();
console.log('Bookmark status:', updatedPost.bookmarked);
```

### Removing a Bookmark
```javascript
// Same endpoint - it toggles the bookmark status
const response = await fetch(`/api/posts/${postId}/react/bookmark`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + userToken
  }
});
const updatedPost = await response.json();
// If it was bookmarked, it's now unbookmarked
```