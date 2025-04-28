# Dockerfile for Backend

# 1. Use Node.js official LTS image
FROM node:18

# 2. Set working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# 4. Install backend dependencies
RUN npm install

# 5. Copy all backend code
COPY . .

# 6. Expose backend port (Adjust if your backend runs on a different port)
EXPOSE 5000

# 7. Command to run your backend
CMD ["npm", "start"]