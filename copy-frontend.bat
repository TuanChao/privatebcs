@echo off
echo 🚀 Copying Frontend build to Backend wwwroot...

REM Clean old frontend files (keep uploads)
if exist "api\publish\wwwroot\static" rmdir /s /q "api\publish\wwwroot\static"
if exist "api\publish\wwwroot\index.html" del "api\publish\wwwroot\index.html"
if exist "api\publish\wwwroot\manifest.json" del "api\publish\wwwroot\manifest.json"
if exist "api\publish\wwwroot\favicon.ico" del "api\publish\wwwroot\favicon.ico"

REM Copy all frontend build files
xcopy "frontend\build\*" "api\publish\wwwroot\" /E /Y

echo ✅ Frontend copied to Backend wwwroot!
echo 📁 Ready to deploy: api\publish\
pause
