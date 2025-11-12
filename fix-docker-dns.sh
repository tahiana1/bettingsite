#!/bin/bash

# Script to fix Docker DNS resolution issues
# This configures Docker daemon to use Google DNS servers

echo "Configuring Docker daemon DNS settings..."

# Create docker directory if it doesn't exist
sudo mkdir -p /etc/docker

# Backup existing daemon.json if it exists
if [ -f /etc/docker/daemon.json ]; then
    echo "Backing up existing daemon.json..."
    sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup
fi

# Create or update daemon.json with DNS configuration
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "dns": ["8.8.8.8", "8.8.4.4", "127.0.0.53"]
}
EOF

echo "Docker daemon DNS configured. Restarting Docker service..."
sudo systemctl restart docker

echo "Docker service restarted. DNS configuration should now work."
echo "You can now run: docker compose up --build"

