FROM node:22-slim

# Install curl for healthchecks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

EXPOSE 3000
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
CMD ["npm", "run", "dev"]