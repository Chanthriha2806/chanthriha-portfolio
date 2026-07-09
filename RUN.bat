@echo off
setlocal enabledelayedexpansion

REM Help Desk Server Launcher

title AI IT Help Desk Server

cls
echo.
echo ================================================================================
echo.
echo     AI IT Help Desk Server v1.0
echo.
echo ================================================================================
echo.
echo Checking Java installation...
echo.

java -version 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java from: https://www.java.com/download
    echo.
    pause
    exit /b 1
)

echo.
echo Starting server on port 8080...
echo.
echo Open your browser and navigate to:
echo    http://localhost:8080
echo.
echo Demo Credentials:
echo    Admin    - admin / helpdesk123
echo    User     - (any username) / user123
echo.
echo ================================================================================
echo.
echo Press Ctrl+C to stop the server
echo.

if exist "HelpDeskServer.jar" (
    java -jar HelpDeskServer.jar
) else (
    java HelpDeskServer
)

pause
