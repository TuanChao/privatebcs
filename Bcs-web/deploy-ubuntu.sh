#!/bin/bash

# BCS-Web OpenResty Deployment Script for Ubuntu
echo "===== BCS-WEB OPENRESTY DEPLOYMENT ====="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo)"
    exit 1
fi

echo ""
echo "[1/6] Installing Dependencies..."
apt update
apt install -y openresty dotnet-runtime-8.0

echo ""
echo "[2/6] Creating directories..."
mkdir -p /var/www/bcs-web
mkdir -p /opt/bcs-api

echo ""
echo "[3/6] Copying application files..."
if [ -d "deploy/frontend" ]; then
    cp -r deploy/frontend/* /var/www/bcs-web/
    chown -R www-data:www-data /var/www/bcs-web
    echo "Frontend copied to /var/www/bcs-web"
else
    echo "Warning: deploy/frontend not found. Run deploy.bat first!"
fi

if [ -d "deploy/api" ]; then
    cp -r deploy/api/* /opt/bcs-api/
    chown -R www-data:www-data /opt/bcs-api
    echo "Backend copied to /opt/bcs-api"
else
    echo "Warning: deploy/api not found. Run deploy.bat first!"
fi

echo ""
echo "[4/6] Creating OpenResty configuration..."
cat > /etc/openresty/conf.d/bcs.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Serve React static files
    location / {
        root /var/www/bcs-web;
        try_files $uri $uri/ /index.html;
        
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API calls
    location /api/ {
        proxy_pass http://localhost:5199/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve uploaded files
    location /uploads/ {
        alias /opt/bcs-api/wwwroot/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }
    
    # Health check
    location /health {
        content_by_lua_block {
            ngx.say("BCS Web is running!")
            ngx.say("Timestamp: " .. os.date())
        }
    }
}
EOF

echo ""
echo "[5/6] Creating systemd service..."
cat > /etc/systemd/system/bcs-api.service << 'EOF'
[Unit]
Description=BCS API
After=network.target

[Service]
Type=notify
WorkingDirectory=/opt/bcs-api
ExecStart=/usr/bin/dotnet /opt/bcs-api/api.dll --urls="http://0.0.0.0:5199"
Restart=always
RestartSec=10
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "[6/6] Starting services..."
systemctl daemon-reload
systemctl enable bcs-api.service
systemctl start bcs-api.service

# Test OpenResty config
openresty -t
if [ $? -eq 0 ]; then
    systemctl restart openresty
    echo ""
    echo "===== DEPLOYMENT COMPLETED ====="
    echo ""
    echo "✅ Services Status:"
    systemctl status bcs-api.service --no-pager -l
    systemctl status openresty --no-pager -l
    echo ""
    echo "🌐 Access your application:"
    echo "Frontend: http://$(hostname -I | awk '{print $1}')"
    echo "Health Check: http://$(hostname -I | awk '{print $1}')/health"
    echo "API: http://$(hostname -I | awk '{print $1}'):5199"
    echo ""
else
    echo "❌ OpenResty configuration error!"
    exit 1
fi
