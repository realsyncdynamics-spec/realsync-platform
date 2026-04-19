#!/bin/bash

# Production Deployment Script
# RealSync Platform - Paperclip Agent System

set -e  # Exit on error

echo "🚀 RealSync Production Deployment"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pre-deployment checks
echo "${YELLOW}Step 1: Pre-deployment checks${NC}"
echo "-------------------------------"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "${RED}Error: Vercel CLI not installed${NC}"
    echo "Install with: npm i -g vercel"
    exit 1
fi

echo "${GREEN}✓${NC} Vercel CLI installed"

# Check if environment variables are set
if [ ! -f ".env.local" ]; then
    echo "${RED}Error: .env.local not found${NC}"
    echo "Copy .env.example and configure:"
    echo "  cp .env.example .env.local"
    exit 1
fi

echo "${GREEN}✓${NC} Environment variables file exists"
echo ""

# Step 2: Run tests
echo "${YELLOW}Step 2: Running tests${NC}"
echo "---------------------"

if [ -d "tests" ] || [ -d "__tests__" ]; then
    pnpm test --passWithNoTests || {
        echo "${RED}Tests failed!${NC}"
        exit 1
    }
    echo "${GREEN}✓${NC} Tests passed"
else
    echo "${YELLOW}⚠${NC}  No tests found, skipping"
fi
echo ""

# Step 3: Build application
echo "${YELLOW}Step 3: Building application${NC}"
echo "----------------------------"

pnpm build || {
    echo "${RED}Build failed!${NC}"
    exit 1
}

echo "${GREEN}✓${NC} Build successful"
echo ""

# Step 4: Database migrations
echo "${YELLOW}Step 4: Database migrations${NC}"
echo "---------------------------"

if command -v supabase &> /dev/null; then
    echo "Running Supabase migrations..."
    supabase db push || {
        echo "${RED}Database migration failed!${NC}"
        read -p "Continue anyway? (y/N): " confirm
        if [[ $confirm != [yY] ]]; then
            exit 1
        fi
    }
    echo "${GREEN}✓${NC} Database migrations completed"
else
    echo "${YELLOW}⚠${NC}  Supabase CLI not found, skipping migrations"
    echo "Install with: brew install supabase/tap/supabase"
fi
echo ""

# Step 5: Deploy to Vercel
echo "${YELLOW}Step 5: Deploying to Vercel${NC}"
echo "----------------------------"

echo "Deploying to production..."
vercel --prod || {
    echo "${RED}Deployment failed!${NC}"
    exit 1
}

echo "${GREEN}✓${NC} Deployed to production"
echo ""

# Step 6: Post-deployment verification
echo "${YELLOW}Step 6: Post-deployment verification${NC}"
echo "------------------------------------"

echo "Waiting for deployment to be ready (10 seconds)..."
sleep 10

# Get production URL from Vercel
PROD_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*')

if [ -z "$PROD_URL" ]; then
    PROD_URL="https://realsync-platform.vercel.app"
fi

echo "Testing production URL: $PROD_URL"

# Health check
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL" || echo "000")

if [ "$HTTP_STATUS" == "200" ]; then
    echo "${GREEN}✓${NC} Production site is live!"
else
    echo "${RED}⚠${NC}  Production site returned status: $HTTP_STATUS"
fi
echo ""

# Final summary
echo "${GREEN}================================="
echo "✅ Deployment Complete!${NC}"
echo "================================="
echo ""
echo "🔗 Production URL: $PROD_URL"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo "🗄️  Supabase Dashboard: https://app.supabase.com"
echo ""
echo "Next steps:"
echo "1. Verify agent dashboard: $PROD_URL/agents"
echo "2. Check Vercel Analytics"
echo "3. Monitor error logs"
echo "4. Test cron jobs (may take 5-10 minutes)"
echo ""
