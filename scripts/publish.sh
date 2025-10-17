#!/bin/bash

# Manual publish script
# Usage: ./scripts/publish.sh [tag]

set -e

TAG=${1:-"latest"}
PACKAGE_NAME=$(node -p "require('./package.json').name")
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo "📦 Publishing $PACKAGE_NAME@$CURRENT_VERSION"
echo "🏷️  NPM tag: $TAG"

# Confirm
echo ""
read -p "Are you sure you want to publish? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publish cancelled"
    exit 1
fi

# Check if already published
if npm view "$PACKAGE_NAME@$CURRENT_VERSION" version &>/dev/null; then
    echo "⚠️  Version $CURRENT_VERSION already published!"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Publish cancelled"
        exit 1
    fi
fi

echo "🧹 Cleaning previous builds..."
yarn clean

echo "🔍 Running checks..."
yarn check

echo "🧪 Running tests..."
yarn test

echo "🏗️  Building..."
yarn build

echo "🔍 Testing dry run..."
npm publish --dry-run --tag "$TAG"

echo ""
echo "✅ All checks passed! Publishing..."

if [ "$TAG" = "latest" ]; then
    npm publish
else
    npm publish --tag "$TAG"
fi

echo "🎉 Successfully published $PACKAGE_NAME@$CURRENT_VERSION with tag '$TAG'"
echo ""
echo "📋 Next steps:"
echo "1. Verify on npm: https://www.npmjs.com/package/$PACKAGE_NAME"
echo "2. Test installation: npm install $PACKAGE_NAME@$CURRENT_VERSION"

if [ "$TAG" = "latest" ]; then
    echo "3. Create GitHub release: https://github.com/ratep1/js-websocket-reconnect-client/releases/new"
fi