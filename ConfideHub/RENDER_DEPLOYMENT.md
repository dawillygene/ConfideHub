# Render Deployment Guide for ConfideHub

## Prerequisites
1. Your code should be in a GitHub repository
2. You should have a Render account (https://render.com)

## Deployment Steps

### 1. Create a New Web Service on Render
1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository

### 2. Configure the Web Service
- **Name**: `confidehub`
- **Environment**: `Docker`
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty if Dockerfile is in root, or set to the directory containing Dockerfile

### 3. Environment Variables
Add these environment variables in Render:

#### Database Configuration (Already set in application.properties)
- `SPRING_DATASOURCE_URL`: `jdbc:postgresql://dpg-d1cplhripnbc73c2ejk0-a.oregon-postgres.render.com:5432/confidehub`
- `SPRING_DATASOURCE_USERNAME`: `dawillygene`
- `SPRING_DATASOURCE_PASSWORD`: `RlyvR77FgbJNPa6CXot8nJKrTybXWtlf`

#### Optional Environment Variables (can override application.properties)
- `SPRING_PROFILES_ACTIVE`: `production`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`
- `JAVA_OPTS`: `-Xmx512m -Xms256m`

### 4. Advanced Settings
- **Port**: `8080` (default)
- **Health Check Path**: `/actuator/health` (if you have actuator enabled)

### 5. Build and Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues

## Important Notes
- The application will automatically create database tables on first run
- The DataInitializer will create required roles (ROLE_USER, ROLE_ADMIN)
- File uploads (profile pictures) will be stored in the container's `/app/uploads/profile-pictures` directory
- For persistent file storage, consider using external storage services like AWS S3

## Troubleshooting
- Check the deployment logs in Render dashboard
- Ensure your PostgreSQL database is accessible
- Verify all environment variables are correctly set
- Make sure the database connection string includes the correct host and port
