# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Only copy package files initially for better caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the full app source
COPY . .

# Stage 2: Final Runtime Image
FROM node:18-alpine

WORKDIR /app

# Copy only production-ready node_modules and app code
COPY --from=builder /app .

# Expose API port
EXPOSE 5000

# Run the server
CMD ["npm", "start"]