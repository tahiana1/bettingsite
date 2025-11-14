#!/bin/bash

echo "=========================================="
echo "Server Status Diagnostics"
echo "=========================================="
echo ""

echo "1. System Uptime and Load:"
echo "----------------------------------------"
uptime
echo ""

echo "2. Memory Usage:"
echo "----------------------------------------"
free -h
echo ""

echo "3. Disk Usage:"
echo "----------------------------------------"
df -h
echo ""

echo "4. CPU Information:"
echo "----------------------------------------"
lscpu | grep -E "CPU\(s\)|Model name|Thread|Core"
echo ""

echo "5. Docker Status:"
echo "----------------------------------------"
systemctl status docker --no-pager -l | head -20
echo ""

echo "6. Docker Disk Usage:"
echo "----------------------------------------"
docker system df
echo ""

echo "7. Running Containers:"
echo "----------------------------------------"
docker ps
echo ""

echo "8. Network Connectivity Test (npm registry):"
echo "----------------------------------------"
time curl -I https://registry.npmjs.org/ 2>&1 | head -5
echo ""

echo "9. Available Disk Space in /root:"
echo "----------------------------------------"
du -sh /root/* 2>/dev/null | sort -h | tail -10
echo ""

echo "10. Recent Docker Build Logs (if any):"
echo "----------------------------------------"
journalctl -u docker.service --no-pager -n 20 2>/dev/null || echo "No recent docker logs found"
echo ""

echo "=========================================="
echo "Diagnostics Complete"
echo "=========================================="

