# Stage 1: Build the React TypeScript application
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package configurations and install dependencies
COPY package*.json ./
RUN npm ci

# Copy codebase and compile bundle
COPY . .
RUN npm run build

# Generate sitemap during the build step
RUN node scripts/generate-sitemap.js

# Stage 2: Serve the compiled app using Nginx
FROM nginx:stable-alpine AS production-stage

# Copy compiled assets from Stage 1
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
