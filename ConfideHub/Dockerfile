# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml first (for better Docker layer caching)
COPY mvnw .
COPY mvnw.cmd .
COPY pom.xml .
COPY .mvn .mvn

# Make the Maven wrapper executable
RUN chmod +x ./mvnw

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Create the uploads directory for profile pictures
RUN mkdir -p /app/uploads/profile-pictures

# Expose the port that the app runs on
EXPOSE 8080

# Set environment variables (these can be overridden at runtime)
ENV SPRING_PROFILES_ACTIVE=production
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Run the jar file
CMD ["java", "-jar", "target/ConfideHub-0.0.1-SNAPSHOT.jar"]
