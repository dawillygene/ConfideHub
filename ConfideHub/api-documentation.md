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

## Error Responses

### 401 Unauthorized
When authentication token is missing or invalid:
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
When user tries to access posts they don't own:
```json
{
  "error": "Forbidden",
  "message": "Access denied"
}
```

### 404 Not Found
When requested post doesn't exist or doesn't belong to user:
```json
{
  "error": "Not Found",
  "message": "Post not found or you don't have permission to access it"
}
```

### 400 Bad Request
When request data is invalid:
```json
{
  "error": "Bad Request",
  "message": "Content is required",
  "details": "Validation failed for field 'content'"
}
```

## Rate Limiting
- Maximum 100 requests per minute per user
- Maximum 10 posts created per hour per user

## Notes
1. All timestamps are in ISO 8601 format (UTC)
2. Posts with `expiryDuration` of "NEVER" will not expire
3. Expired posts are automatically cleaned up by the system
4. AI-generated titles are created automatically when content is provided
5. Anonymous usernames are generated deterministically for each post
6. All operations are logged for security and auditing purposes

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