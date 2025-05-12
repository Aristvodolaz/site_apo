# Base on official Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save time if dependencies haven't changed
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"] 