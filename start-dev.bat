@echo off
echo 🚀 Starting Smart Off Plan Development Environment
echo.

echo 📦 Installing backend dependencies...
cd smart-off-plan-backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)

echo.
echo 🔧 Starting backend server...
start "Smart Off Plan Backend" cmd /k "npm run dev"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 📦 Installing frontend dependencies...
cd ..
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)

echo.
echo 🌐 Starting frontend server...
start "Smart Off Plan Frontend" cmd /k "npm run dev"

echo.
echo ✅ Development environment started!
echo.
echo 🔗 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   Backend Health: http://localhost:5000/api/health
echo   Backend Properties: http://localhost:5000/api/properties
echo.
echo 📝 To stop servers, close the terminal windows or press Ctrl+C in each
echo.
pause
