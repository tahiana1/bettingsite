# Use base golang image from Docker Hub
FROM golang:latest

WORKDIR /app

# Copy the go.mod and go.sum, download the dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy rest of the application source code
COPY . .

ENV GOTRACEBACK=single

# Compile the application to /app/backend.
# Skaffold passes in debug-oriented compiler flags
ARG SKAFFOLD_GO_GCFLAGS
RUN echo "Go gcflags: ${SKAFFOLD_GO_GCFLAGS}"
RUN go mod tidy
  
# Install Air for live-reloading
RUN go install github.com/air-verse/air@latest

# Expose the port for the Go backend
EXPOSE 8080

# Command to run Air for live-reloading
CMD ["air"]