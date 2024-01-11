# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./
COPY yarn.lock ./

# Install the dependencies
RUN yarn install --frozen-lockfile && yarn cache clean

# Copy the application code into the container
COPY . ./

# Expose the port your app runs on

# Specify the command to run on container start
CMD ["npm", "start"]
