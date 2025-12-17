# ---------- Stage 1: Build the React UI ----------
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies using clean, deterministic install
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the production bundle
RUN npm run build


# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy build from previous stage to nginx html folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Run nginx in non-daemon mode
CMD ["nginx", "-g", "daemon off;"]
