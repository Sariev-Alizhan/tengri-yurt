#!/bin/bash

echo "🚀 Setting up Tengri Yurt..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "⚠️  Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "✅ .env.local created. Please fill in your API keys!"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
  echo "✅ Dependencies installed successfully!"
  echo ""
  echo "🎉 Setup complete!"
  echo ""
  echo "Next steps:"
  echo "1. Edit .env.local and add your Supabase and Resend API keys"
  echo "2. Run 'npm run dev' to start the development server"
  echo "3. Open http://localhost:3000/en in your browser"
else
  echo "❌ Installation failed. Please check the error messages above."
  exit 1
fi
