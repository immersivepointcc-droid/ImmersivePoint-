@echo off
title ImmersivePoint Platform
cd /d "%~dp0"
start "" http://localhost:3000/dashboard/
node server.js
