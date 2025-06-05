# Build stage
FROM node:23 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

RUN echo 'VITE_API_BASE_URL="https://media-manager-back-593442013979.europe-west9.run.app"' >> .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if you have a custom one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run expects this port)
EXPOSE 8080

# Update nginx configuration to listen on port 8080 instead of 80
RUN sed -i.bak 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Make sure nginx runs in the foreground
CMD ["nginx", "-g", "daemon off;"]
