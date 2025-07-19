@echo off
echo Installing Meet Up dependencies...
echo.

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)
echo Server dependencies installed successfully!
echo.

echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)
echo Client dependencies installed successfully!
echo.

echo All dependencies installed successfully!
echo.
echo To start the application:
echo 1. Open a terminal and run: cd server ^&^& npm start
echo 2. Open another terminal and run: cd client ^&^& npm start
echo 3. Open http://localhost:3000 in your browser
echo.
pause 