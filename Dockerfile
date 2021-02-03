FROM node:12
# Create app directory
WORKDIR /usr/src/server
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
# Set ENV
ENV DEBUG=TRUE
ENV MONGO_CONNECTION_STRING='mongodb://mongo/tokenmanager'
#Expose port and start application
EXPOSE 3001
CMD [ "npm", "run", "prod" ]