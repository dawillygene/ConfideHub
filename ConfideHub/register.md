# User Registration API Documentation

## Overview
This document describes the user registration API for the ConfideHub application. The registration endpoint allows new users to create accounts in the system.

## API Endpoint

### Register New User
**POST** `/api/auth/signup`

Create a new user account in the system.

## Request Format

### Headers
```http
Content-Type: application/json
```

### Required Parameters

| Parameter | Type | Validation | Description |
|-----------|------|------------|-------------|
| `username` | String | 3-20 characters, required | Unique username for the user |
| `email` | String | Valid email format, max 50 characters, required | User's email address |
| `password` | String | 6-40 characters, required | User's password |

### Request Body Example
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "mySecurePassword123"
}
```

## Response Format

### Successful Registration (200 OK)
```json
{
  "message": "User registered successfully!"
}
```

### Error Responses

#### Username Already Taken (400 Bad Request)
```json
{
  "message": "Error: Username is already taken!"
}
```

#### Email Already In Use (400 Bad Request)
```json
{
  "message": "Error: Email is already in use!"
}
```

#### Validation Errors (400 Bad Request)
The API will return appropriate error messages for:
- Username too short (less than 3 characters)
- Username too long (more than 20 characters)
- Username is blank or empty
- Invalid email format
- Email too long (more than 50 characters)
- Email is blank or empty
- Password too short (less than 6 characters)
- Password too long (more than 40 characters)
- Password is blank or empty

## Implementation Example

### JavaScript/Fetch API
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    
    console.log('Registration successful:', data.message);
    return data;
    
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

// Usage example
registerUser({
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'securePassword123'
});
```

### cURL Example
```bash
curl -X POST /api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "mySecurePassword123"
  }'
```

## Security Features

### Password Security
- Passwords are automatically encrypted using BCrypt hashing
- Minimum 6 characters required for password strength
- Maximum 40 characters to prevent potential DoS attacks

### Data Validation
- Username and email uniqueness is enforced at the database level
- Server-side validation for all input parameters
- Email format validation using standard email regex patterns

### Authentication Tokens
- Upon successful registration, authentication tokens are automatically generated
- Access and refresh tokens are set as HTTP-only cookies for security
- Tokens enable immediate access to protected resources after registration

## Business Rules

1. **Unique Constraints**: Both username and email must be unique across all users
2. **Default Role**: All registered users are automatically assigned the standard user role
3. **Immediate Access**: Successfully registered users receive authentication tokens and can immediately access the application
4. **Case Sensitivity**: Usernames and emails are case-sensitive
5. **No Email Verification**: Currently, no email verification is required (immediate account activation)

## Rate Limiting
- Standard rate limiting applies to prevent abuse
- Consider implementing stricter limits on registration attempts from the same IP

## Notes
- The registration endpoint is publicly accessible (no authentication required)
- Cross-origin requests are supported for web applications
- Successful registration automatically logs the user in
- The system maintains user privacy and does not expose sensitive information in responses

## Error Handling Best Practices
- Always check the HTTP status code before processing the response
- Handle network errors gracefully in client applications
- Provide user-friendly error messages based on the API response
- Implement client-side validation to reduce server requests for obvious validation errors

---

**Last Updated**: June 19, 2025  
**API Version**: 1.0
