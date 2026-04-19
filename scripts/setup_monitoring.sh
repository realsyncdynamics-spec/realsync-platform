#!/bin/bash
set -euo pipefail

echo "🚀 RealSync Monitoring Setup"
echo "============================="

# Check if GCloud is authenticated
if ! gcloud auth list 2>&1 | grep -q "ACTIVE"; then
    echo "❌ Not authenticated with gcloud. Run 'gcloud auth login' first."
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo "❌ No GCP project set. Run 'gcloud config set project PROJECT_ID'."
    exit 1
fi

echo "📊 Setting up monitoring alerts for project: $PROJECT_ID"

# Create notification channel (email)
echo "📧 Creating notification channel..."
gcloud alpha monitoring channels create \
    --display-name="RealSync Alerts" \
    --type=email \
    --channel-labels=email_address=alerts@realsyncdynamics.de \
    --project=$PROJECT_ID || echo "Channel may already exist"

# Get channel ID
CHANNEL_ID=$(gcloud alpha monitoring channels list --project=$PROJECT_ID \
    --filter="displayName:RealSync" --format="value(name)" | head -1)

if [ -z "$CHANNEL_ID" ]; then
    echo "❌ Failed to create/find notification channel"
    exit 1
fi

echo "✅ Notification channel ready: $CHANNEL_ID"

echo ""
echo "✅ Monitoring setup complete!"
echo "📊 View alerts: https://console.cloud.google.com/monitoring/alerting?project=$PROJECT_ID"
