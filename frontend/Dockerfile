# Dockerfile for Frontend

# 1. Use official Node.js image
FROM node:18

# 2. Set working directory
WORKDIR /app

# 3. Copy package.json and package-lock.json first
COPY package*.json ./

# 4. Install frontend dependencies
RUN npm install

# 5. Copy the rest of the frontend app
COPY . .

# 6. Build the React app
RUN npm run build

# 7. Install a lightweight server to serve static files
RUN npm install -g serve

# 8. Expose port 3000
EXPOSE 3000

# 9. Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
