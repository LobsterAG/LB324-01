FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy app source
COPY . .

# Install app dependencies
RUN yarn install
RUN yarn add jest
RUN yarn add eslint

# CI in Image Build Process
RUN yarn jest
RUN node_modules/.bin/tsc
RUN yarn build
RUN yarn eslint

# Build
RUN yarn build

ENTRYPOINT ["node", "./build/index.js"]