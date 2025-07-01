#!/bin/bash

echo "🚀 Starting Smart Off Plan Development Environment"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd smart-off-plan-backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Backend dependencies already installed."
fi

echo ""
echo "🔧 Starting backend server..."

# Start backend in background
npm run dev &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"

echo ""
echo "⏳ Waiting for backend to start..."
sleep 5

echo ""
echo "📦 Installing frontend dependencies..."
cd ..

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed."
fi

echo ""
echo "🌐 Starting frontend server..."

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"

echo ""
echo "✅ Development environment started!"
echo ""
echo "🔗 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  Backend Health: http://localhost:5000/api/health"
echo "  Backend Properties: http://localhost:5000/api/properties"
echo ""
echo "📝 To stop servers, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "Press Ctrl+C to stop all servers..."
wait
