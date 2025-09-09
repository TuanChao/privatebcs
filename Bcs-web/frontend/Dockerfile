FROM node:22.11.0

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Set npm registry and install dependencies
RUN npm install

# Install Bootstrap
RUN npm install bootstrap

# Copy all frontend files
COPY . .

# Use development server for hot reload
CMD ["npm", "start"]

# Expose the port
EXPOSE 3000
