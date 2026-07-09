@echo off
REM Create Windows Desktop Shortcuts

setlocal enabledelayedexpansion

title Create Shortcuts

cd /d %~dp0

REM Get current directory
set "dir=%cd%"

REM Create VBScript to generate shortcuts
(
    echo Set oWS = WScript.CreateObject("WScript.Shell"^)
    echo sLinkFile = oWS.SpecialFolders("Desktop"^) ^& "\Help Desk Server.lnk"
    echo Set oLink = oWS.CreateShortcut(sLinkFile^)
    echo oLink.TargetPath = "%dir%\RUN.bat"
    echo oLink.WorkingDirectory = "%dir%"
    echo oLink.Description = "AI IT Help Desk Server"
    echo oLink.IconLocation = "%dir%\icon.ico"
    echo oLink.Save
) > create_shortcut.vbs

cscript create_shortcut.vbs

del create_shortcut.vbs

echo.
echo Shortcut created on Desktop!
echo You can now launch the server by double-clicking the shortcut.
echo.
pause
