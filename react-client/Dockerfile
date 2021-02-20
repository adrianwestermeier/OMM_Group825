# FROM node:12-alpine as builder
# WORKDIR /app
# COPY package.json /app/package.json
# RUN npm install
# COPY . /app
# RUN npm run build

# Use Node as a parent image
FROM node:12-alpine
# Set the working directory to /client
WORKDIR /client
# copy package.json into the container at /client
COPY package.json /client/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /client
COPY . /client/
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]

# FROM node:12-alpine
#  WORKDIR /nodeapp
#  COPY . .
#  RUN npm install
#  CMD ["npm", "start"]