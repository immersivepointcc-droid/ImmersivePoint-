#!/bin/bash
# Creates a desktop shortcut (alias) for ImmersivePoint on macOS
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DESKTOP="$HOME/Desktop"

chmod +x "$SCRIPT_DIR/start.command"

osascript <<EOF
tell application "Finder"
    set startFile to POSIX file "$SCRIPT_DIR/start.command" as alias
    set desktopFolder to POSIX file "$DESKTOP" as alias
    try
        make new alias file at desktopFolder to startFile with properties {name:"ImmersivePoint"}
    on error
        -- Already exists, replace it
        set existingAlias to file "ImmersivePoint" of desktopFolder
        delete existingAlias
        make new alias file at desktopFolder to startFile with properties {name:"ImmersivePoint"}
    end try
end tell
EOF

echo ""
echo "  Shortcut created on your Desktop!"
echo "  Double-click 'ImmersivePoint' to launch."
echo ""
