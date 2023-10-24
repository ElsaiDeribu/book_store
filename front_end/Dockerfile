# Use an official Node.js runtime as the base image
FROM node:18.13

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose the port that the Next.js app will run on (default is 3000)
EXPOSE 3000

# Define the command to start the Next.js application
CMD ["npm", "run", "dev"]