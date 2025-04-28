# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:stable-alpine

# Clean out default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output to nginx directory
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom nginx.conf (advanced caching)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]