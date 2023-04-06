FROM node:18-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN yarn install
RUN yarn add jest
RUN yarn add eslint

# Copy app source
COPY . .

# CI in Image Build Process
RUN yarn lint
RUN yarn test
RUN node_modules/.bin/tsc

# Build
RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]