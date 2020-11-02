# Use Node.js 14
FROM node:14.15.0-alpine

# Create node_modules folder
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

# Set CWD
WORKDIR /home/node/app
COPY package.json ./

USER node
RUN npm install --only=production
COPY --chown=node:node dist ./dist

# Expose default port and start the application
EXPOSE 3000
CMD ["node", "."]
