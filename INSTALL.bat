@echo off
setlocal enabledelayedexpansion

REM Help Desk Server Installer for Windows

title Help Desk Server - Setup

cls
echo.
echo ================================================================================
echo.
echo     AI IT Help Desk Server - Installation
echo.
echo ================================================================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo.
    echo Please install Java 11 or higher from: https://www.java.com/download
    echo Then add Java to your system PATH
    echo.
    pause
    exit /b 1
)

echo ✓ Java detected
java -version
echo.

REM Create directories
if not exist "data" mkdir data
if not exist "logs" mkdir logs

echo ✓ Created data and logs directories
echo.

REM Create configuration file
(
    echo # Help Desk Server Configuration
    echo # Updated: %date% %time%
    echo.
    echo server.port=8080
    echo server.name=AI IT Help Desk
    echo.
    echo # Database settings
    echo database.file=data/helpdesk-requests.json
    echo.
    echo # Admin credentials
    echo admin.username=admin
    echo admin.password=helpdesk123
) > config.properties

echo ✓ Created config.properties
echo.

echo ================================================================================
echo.
echo Installation Complete!
echo.
echo To start the server, run one of these commands:
echo.
echo   Option 1: Double-click START.bat
echo   Option 2: Run command: java -jar HelpDeskServer.jar
echo.
echo Then open: http://localhost:8080
echo.
echo Login with:
echo   Admin    - admin / helpdesk123
echo   User     - (any username) / user123
echo.
echo ================================================================================
echo.
pause
