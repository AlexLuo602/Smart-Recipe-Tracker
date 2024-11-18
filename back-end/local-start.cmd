@echo off

:: Change to the directory where the script is located
cd %~dp0

:: Configure the oracle instant client env variable
set PATH=%PATH%;"C:\Users\Alex\Documents\UBC\Third Year\CPSC 304 Sample Project\instantclient-basiclite-windows.x64-19.20.0.0.0dbru\instantclient_19_20"

:: Start Node application
node server.js

exit /b 0
