FROM node:12
# Create app directory
WORKDIR /usr/src/client
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
# Build
RUN npm run build
#Expose port and start application
EXPOSE 3000
CMD [ "npm", "start" ]