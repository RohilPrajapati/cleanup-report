# Stage: Build React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy only necessary source files
COPY public ./public
COPY src ./src

# Build React
RUN npm run build

# Output: build/ folder is ready

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Copy React build output to Nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]