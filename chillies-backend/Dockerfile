# Use a slim Node.js base image to avoid native build issues
FROM node:20-slim

# Set working directory inside the container
WORKDIR /app

# Install production dependencies first (better layer caching)
COPY chillies-backend/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy the backend source
COPY chillies-backend/. ./

# Set the app to listen on the desired port
ENV PORT=8989

# Expose the port the app runs on
EXPOSE 8989

# Start the server
CMD ["npm", "start"]

