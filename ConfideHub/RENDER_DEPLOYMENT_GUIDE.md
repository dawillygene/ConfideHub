# ConfideHub Deployment Guide for Render

## Prerequisites
- GitHub repository with your ConfideHub code
- Render account (free tier available)
- PostgreSQL database (already configured in your application.properties)

## Deployment Steps

### 1. Prepare Your Repository
Make sure your repository contains:
- ✅ `Dockerfile` (already created)
- ✅ `.dockerignore` (already created)
- ✅ `pom.xml` with proper configuration
- ✅ Source code in `src/` directory

### 2. Deploy to Render

#### Option A: Deploy via Render Dashboard
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `confidehub` (or your preferred name)
   - **Environment**: `Docker`
   - **Build Command**: Leave empty (Docker handles this)
   - **Start Command**: Leave empty (Docker handles this)
   - **Instance Type**: Free tier or Starter ($7/month)

#### Option B: Deploy using render.yaml (Infrastructure as Code)
Create a `render.yaml` file in your repository root:

```yaml
services:
  - type: web
    name: confidehub
    env: docker
    repo: https://github.com/yourusername/your-repo-name.git
    dockerfilePath: ./Dockerfile
    envVars:
      - key: SPRING_PROFILES_ACTIVE
        value: production
      - key: JAVA_OPTS
        value: "-Xmx512m -Xms256m"
      - key: PORT
        value: 8080
    disk:
      name: confidehub-uploads
      mountPath: /app/uploads
      sizeGB: 1
```

### 3. Environment Variables (Optional)
If you want to override database settings or other configurations, you can set environment variables in Render:

- `SPRING_DATASOURCE_URL`: Your PostgreSQL connection string
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `SPRING_APP_JWTSECRET`: Your JWT secret key
- `PORT`: 8080 (Render expects this)

### 4. Database Configuration
Your application is already configured to use PostgreSQL on Render. The current configuration in `application.properties` should work, but consider using environment variables for production secrets.

### 5. File Uploads
The Docker container creates an `/app/uploads/profile-pictures` directory. For persistent storage across deployments, consider:
- Using Render's disk storage (as shown in render.yaml)
- Or integrating with cloud storage (AWS S3, Google Cloud Storage)

## Deployment Commands

### Build and Test Locally
```bash
# Build the Docker image
docker build -t confidehub .

# Run the container locally (optional)
docker run -p 8080:8080 confidehub
```

### Deploy via Render CLI (Optional)
```bash
# Install Render CLI
npm install -g @render/cli

# Deploy
render deploy
```

## Post-Deployment

### Health Check
Your application will be available at: `https://your-service-name.onrender.com`

Test the health endpoint:
```bash
curl https://your-service-name.onrender.com/actuator/health
```

### Monitor Logs
- View logs in Render dashboard
- Monitor application performance
- Check for any startup issues

## Common Issues and Solutions

### 1. Port Configuration
Render expects your application to listen on the port specified by the `PORT` environment variable. Your Spring Boot application should automatically use this.

### 2. Database Connection
If you encounter database connection issues:
- Verify the database URL is accessible from Render
- Check if the database allows external connections
- Ensure credentials are correct

### 3. Memory Issues
If the application runs out of memory:
- Increase instance type in Render
- Adjust `JAVA_OPTS` to use less memory: `-Xmx256m -Xms128m`

### 4. Build Timeouts
If Docker build times out:
- Consider using a multi-stage Dockerfile to reduce final image size
- Optimize Maven dependencies caching

## Security Recommendations

1. **Environment Variables**: Move sensitive data (database passwords, JWT secrets) to environment variables
2. **HTTPS**: Render provides HTTPS by default
3. **Database Security**: Ensure your PostgreSQL database has proper access controls
4. **File Uploads**: Implement file size limits and validation

## Cost Optimization

- **Free Tier**: Use Render's free tier for development/testing
- **Starter Tier**: $7/month for production with better performance
- **Database**: Consider Render's managed PostgreSQL for easier maintenance

Your ConfideHub application is now ready for deployment on Render! 🚀
