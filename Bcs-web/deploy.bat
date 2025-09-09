@echo off
echo ===== BCS-WEB DEPLOYMENT SCRIPT =====

echo.
echo [1/4] Building Frontend...
cd frontend
call yarn install
call yarn build
if %errorlevel% neq 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo [2/4] Building Backend...
cd ..\api
dotnet restore
dotnet publish -c Release -o ..\deploy\api
if %errorlevel% neq 0 (
    echo Backend build failed!
    pause
    exit /b 1
)

echo.
echo [3/4] Copying Frontend build...
cd ..
if not exist "deploy" mkdir deploy
if not exist "deploy\frontend" mkdir deploy\frontend
xcopy /E /I /Y "frontend\build\*" "deploy\frontend\"

echo.
echo [4/4] Creating deployment package...
echo Frontend: deploy\frontend\
echo Backend: deploy\api\
echo.

echo ===== DEPLOYMENT READY =====
echo.
echo Next steps for OpenResty deployment:
echo 1. Update .env.production with your server IP
echo 2. Update appsettings.Production.json with your database connection
echo 3. Copy deploy folder to your Ubuntu server
echo 4. Setup OpenResty config at /etc/openresty/conf.d/bcs.conf
echo 5. Create systemd service for API: /etc/systemd/system/bcs-api.service
echo 6. Start services: sudo systemctl start bcs-api.service ^&^& sudo systemctl restart openresty
echo 7. Check health: http://YOUR_SERVER_IP/health
echo.

pause
