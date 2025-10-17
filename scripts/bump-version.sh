#!/bin/bash

# Simple version bump script
# Usage: ./scripts/bump-version.sh <version>

set -e

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 0.0.15"
    exit 1
fi

echo "🚀 Bumping version to $VERSION"

# Update package.json version
yarn version --new-version "$VERSION" --no-git-tag-version

# Update changelog
echo "📝 Don't forget to update CHANGELOG.md with version $VERSION"

# Show what changed
echo "✅ Version bumped to $VERSION"
echo ""
echo "Next steps:"
echo "1. Update CHANGELOG.md"
echo "2. Commit changes: git add . && git commit -m 'chore(release): bump version to $VERSION'"
echo "3. Push to trigger release: git push origin main"
echo "4. Or use the GitHub Release workflow for manual releases"