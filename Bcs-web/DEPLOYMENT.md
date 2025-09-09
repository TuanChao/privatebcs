# 🚀 BCS-Web Deployment Guide

## 📋 Pre-deployment Checklist

### 1. Update Configuration Files

**Frontend (.env.production):**
```env
REACT_APP_API_URL=http://YOUR_SERVER_IP:5199
```

**Backend (appsettings.Production.json):**
- Update connection string with your database server
- Update JWT Issuer/Audience URLs
- Update SendGrid API key

### 2. Build and Deploy

**Quick Deploy:**
```bash
# Run the deployment script
deploy.bat
```

**Manual Deploy:**
```bash
# Frontend
cd frontend
yarn build

# Backend
cd ../api
dotnet publish -c Release -o ../deploy/api
```

## 🖥️ Server Setup

### Ubuntu Server with OpenResty

1. **Install Dependencies:**
```bash
sudo apt update
sudo apt install openresty dotnet-runtime-8.0
```

2. **Copy Files:**
```bash
# Frontend
sudo cp -r deploy/frontend/* /var/www/bcs-web/

# Backend
sudo cp -r deploy/api /opt/bcs-api/
sudo chown -R www-data:www-data /var/www/bcs-web
```

3. **Setup OpenResty Configuration:**
```bash
sudo nano /etc/openresty/conf.d/bcs.conf
```

**OpenResty Config:**
```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;
    
    # Serve React static files
    location / {
        root /var/www/bcs-web;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API calls to .NET backend
    location /api/ {
        proxy_pass http://localhost:5199/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # API timeout settings
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Serve uploaded files
    location /uploads/ {
        alias /opt/bcs-api/wwwroot/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }
    
    # Health check endpoint with Lua
    location /health {
        content_by_lua_block {
            ngx.say("BCS Web is running!")
            ngx.say("Timestamp: " .. os.date())
        }
    }
    
    # Optional: Rate limiting with Lua
    location /api/auth/ {
        access_by_lua_block {
            local limit_req = require "resty.limit.req"
            local lim, err = limit_req.new("my_limit_req_store", 5, 10)
            if not lim then
                ngx.log(ngx.ERR, "failed to instantiate a resty.limit.req object: ", err)
                return ngx.exit(500)
            end
        }
        
        proxy_pass http://localhost:5199/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **Create systemd service for .NET API:**
```bash
sudo nano /etc/systemd/system/bcs-api.service
```

**Service file:**
```ini
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
```

5. **Start Services:**
```bash
# Test OpenResty config
sudo openresty -t

# Start services
sudo systemctl enable bcs-api.service
sudo systemctl start bcs-api.service
sudo systemctl restart openresty

# Check status
sudo systemctl status bcs-api.service
sudo systemctl status openresty
```

### Ubuntu Server with Nginx (Alternative)

1. **Install Dependencies:**
```bash
sudo apt update
sudo apt install nginx dotnet-runtime-8.0
```

2. **Copy Files:**
```bash
# Frontend
sudo cp -r deploy/frontend/* /var/www/bcs-web/

# Backend
sudo cp -r deploy/api /opt/bcs-api/
```

3. **Setup Nginx:**
```nginx
server {
    listen 80;
    server_name YOUR_SERVER_IP;
    
    location / {
        root /var/www/bcs-web;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:5199/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **Start Services:**
```bash
# Start API
cd /opt/bcs-api
dotnet api.dll &

# Start Nginx
sudo systemctl start nginx
```

### Windows Server with IIS

1. **Install .NET 8.0 Hosting Bundle**
2. **Create IIS Sites:**
   - Frontend: Port 80 → `deploy/frontend`
   - Backend: Port 5199 → `deploy/api`

## 🎯 Access Your Application

- **Frontend:** `http://YOUR_SERVER_IP`
- **Backend API:** `http://YOUR_SERVER_IP:5199`
- **Admin Panel:** `http://YOUR_SERVER_IP/admin`

## ✅ Deployment Features

- ✅ No hardcoded localhost URLs
- ✅ Environment-based configuration
- ✅ Production-ready settings
- ✅ Consistent API calls
- ✅ Proper image URL handling
- ✅ Error handling and logging
- ✅ CORS configuration
- ✅ SSL/HTTPS ready (optional)

## 🔧 Troubleshooting

**API Connection Issues:**
- Check if backend is running on port 5199
- Verify CORS settings in Program.cs
- Check firewall settings

**Image Loading Issues:**
- Verify uploads folder permissions
- Check API_URL in .env.production

**Database Issues:**
- Update connection string in appsettings.Production.json
- Run database migrations if needed

## 📞 Support

For deployment issues, check the logs:
- Frontend: Browser console
- Backend: Application logs in server
