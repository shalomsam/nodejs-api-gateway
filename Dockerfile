FROM node:12
# Create app directory
WORKDIR /usr/app
# Install app dependencies
COPY package.json ./
COPY .env* ./.env*
# Copy app source code
COPY . .
RUN npm install
# Set ENV
ENV DEBUG=TRUE
ENV MONGO_CONNECTION_STRING='mongodb://mongo/tokenmanager'
#Expose port and start application
EXPOSE 3001
CMD [ "npm", "start" ]