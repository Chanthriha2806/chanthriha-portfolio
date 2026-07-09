#!/bin/bash

# Help Desk Server Installer for Mac/Linux

clear
echo ""
echo "================================================================================"
echo ""
echo "     AI IT Help Desk Server - Installation"
echo ""
echo "================================================================================"
echo ""

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed"
    echo ""
    echo "Please install Java 11 or higher from: https://www.java.com/download"
    echo ""
    exit 1
fi

echo "✓ Java detected"
java -version
echo ""

# Create directories
mkdir -p data logs

echo "✓ Created data and logs directories"
echo ""

# Create configuration file
cat > config.properties << 'EOF'
# Help Desk Server Configuration

server.port=8080
server.name=AI IT Help Desk

# Database settings
database.file=data/helpdesk-requests.json

# Admin credentials
admin.username=admin
admin.password=helpdesk123
EOF

echo "✓ Created config.properties"
echo ""

echo "================================================================================"
echo ""
echo "Installation Complete!"
echo ""
echo "To start the server, run:"
echo ""
echo "   java -jar HelpDeskServer.jar"
echo ""
echo "Then open: http://localhost:8080"
echo ""
echo "Login with:"
echo "   Admin    - admin / helpdesk123"
echo "   User     - (any username) / user123"
echo ""
echo "================================================================================"
echo ""
