#!/bin/bash

# Setup script for development tools
# Run this after cloning the repository

set -e  # Exit on any error

echo "🔧 Setting up development tools for Minimalist Django..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Install pre-commit hooks
echo "🪝 Installing pre-commit hooks..."
pre-commit install

# Run quality check to ensure everything is working
echo "✅ Running quality check..."
pnpm quality

echo "🎉 Development tools setup complete!"
echo ""
echo "Available commands:"
echo "  pnpm quality    - Run full quality check"
echo "  pnpm lint       - Run ESLint"
echo "  pnpm lint:fix   - Auto-fix ESLint issues"
echo "  pnpm format     - Format code with Prettier"
echo "  pnpm type-check - Check TypeScript types"
echo ""
echo "Pre-commit hooks will automatically run on every commit."
