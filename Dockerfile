FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install --only=production

# Copy source files
COPY . .

# Create public directory if missing
RUN mkdir -p public

# Build app
RUN npm run build

# Set environment
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]