#!/bin/bash

# Help Desk Server Launcher for Mac/Linux

clear
echo ""
echo "================================================================================"
echo ""
echo "     AI IT Help Desk Server v1.0"
echo ""
echo "================================================================================"
echo ""
echo "Checking Java installation..."
echo ""

java -version 2>&1
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Java is not installed"
    echo "Please install Java from: https://www.java.com/download"
    echo ""
    exit 1
fi

echo ""
echo "Starting server on port 8080..."
echo ""
echo "Open your browser and navigate to:"
echo "   http://localhost:8080"
echo ""
echo "Demo Credentials:"
echo "   Admin    - admin / helpdesk123"
echo "   User     - (any username) / user123"
echo ""
echo "================================================================================"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

if [ -f "HelpDeskServer.jar" ]; then
    java -jar HelpDeskServer.jar
else
    java HelpDeskServer
fi
