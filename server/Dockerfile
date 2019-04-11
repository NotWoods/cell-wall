# Create app directory
FROM node:10 AS base
WORKDIR /usr/src/app

# Install app dependencies
FROM base AS development

COPY package*.json ./

# Set aside production dependencies for later
RUN npm ci --production
RUN cp -R node_modules /tmp/node_modules

# Install all dependencies and add source code
RUN npm ci
COPY . .

# Run tests and linter, then build production code
FROM development AS builder
RUN npm test
RUN npm run build

# Release includes bare minimum required to run the app, copied from builder
FROM base AS release
COPY --from=builder /tmp/node_modules ./node_modules
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/lib ./lib
COPY --from=builder /usr/src/app/package*.json ./
EXPOSE 3000
CMD ["node", "lib/server.js"]
