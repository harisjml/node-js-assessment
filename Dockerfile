# Use official Node.js image
FROM node:18-alpine

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of your app files
COPY . .

# Expose the port your app listens on (you can change if not 3000)
EXPOSE 3000

# Start the app (use node, not nodemon in production)
CMD ["node", "server.js"]
