FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
# Remove this line:
# EXPOSE 5010
CMD ["node", "server.js"]