#!/bin/bash

echo "🔧 Emergency Deployment Fix"
echo "============================="

# 1. Clean install
echo "🧹 Cleaning old builds..."
rm -rf node_modules .next

# 2. Fresh install
echo "📦 Installing dependencies..."
pnpm install

if [ $? -ne 0 ]; then
  echo "❌ Dependency installation failed!"
  exit 1
fi

# 3. Build locally to catch errors
echo "🔨 Building application..."
pnpm build

if [ $? -eq 0 ]; then
  echo "✅ Build successful!"
  
  # 4. Commit if there are changes
  if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Committing changes..."
    git add -A
    git commit -m "Emergency deploy fix: Update dependencies and configs"
    git push origin main
  fi
  
  # 5. Deploy
  echo "🚀 Deploying to Vercel..."
  vercel --prod --yes
  
  if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Check deployment at: https://vercel.com/dashboard"
    echo "2. Verify site is working"
    echo "3. Test /agents dashboard"
  else
    echo "❌ Deployment failed!"
    exit 1
  fi
else
  echo "❌ Build failed! Check errors above."
  echo ""
  echo "Common fixes:"
  echo "1. Check TypeScript errors: pnpm tsc --noEmit"
  echo "2. Check ESLint errors: pnpm lint"
  echo "3. Read DEPLOYMENT_FIXES.md for solutions"
  exit 1
fi
