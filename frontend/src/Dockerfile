FROM node:22-slim

WORKDIR /app

EXPOSE 3000
COPY package.json package-lock.json ./
RUN npm ci -f

COPY . .
CMD ["npm", "run", "dev"]