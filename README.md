
# Prerequisites
-  Ubuntu 24.04
-  Docker
-  Go 1.24.2
-  Node 22.x
-  Yarn 1.22.x

# Environment
-  Frontend
```
API_ADDR=backend
API_PORT=8080
PROXY_PORT=8080
```

- Backend
```
PORT=8080
DNS="host=postgres user=postgres password=postgres dbname=betting port=5432 sslmode=disable"
BACKEND_DB_NAME=betting
BACKEND_DB_USER=postgres
BACKEND_DB_PASSWORD=postgres
BACKEND_DB_HOST=postgres
BACKEND_DB_PORT=5432
BACKEND_DB_URL=postgres://postgres:postgres@postgres:5432/betting?sslmode=disable

FRONTEND_HOST=frontend
FRONTEND_PORT=3000

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=myredispass
REDIS_ADDR=redis:6379

KAFKA_BROKERS=kafka:9092
KAFKA_BROKER_ID=1
KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092
KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
KAFKA_AUTO_CREATE_TOPICS_ENABLE='true'

ZOOKEEPER_CLIENT_PORT=2181
ZOOKEEPER_TICK_TIME=2000

JWT_SECRET=your-secret-key-change-me
```

# Run project

```bash
docker compose up
```

# Clean project
```bash
docker compose down
docker system prune -f
```
# Build project
```bash
docker compose up --build
```

# Update graphql model
```bash
go run github.com/99designs/gqlgen generate
```

# Install modules 
```bash
cd bettingsite/frontend/src
yarn install
```
# Build frontend
```bash
yarn build
```