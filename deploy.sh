#!/bin/bash
# VaakSuraksha Vercel Deployment Script
# Run: ./deploy.sh

set -e

echo "🚀 VaakSuraksha Deployment Script"
echo "=================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel:"
    vercel login
fi

# Build locally first to catch errors
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "☁️ Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site should be live at the URL shown above."
echo ""
echo "📋 Post-deployment checklist:"
echo "   1. Set POSTGRES_URL in Vercel Environment Variables"
echo "   2. Run 'npx tsx scripts/init-db.ts' with production DB URL"
echo "   3. Run 'npx tsx scripts/seed-accuracy.ts' to populate metrics"
echo "   4. Test /api/health and /api/accuracy endpoints"