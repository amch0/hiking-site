# Use Node.js LTS version as the base image for development
FROM node:18 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json . 

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 8080

# Start the development server
CMD ["npm", "run", "dev"]
