FROM node:current-alpine AS deps

WORKDIR /app

EXPOSE 3000
COPY . .
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else echo "Lock file not found." && exit 1; \
    fi

RUN yarn install --no-package-lock
COPY . .
CMD ["yarn", "dev"]