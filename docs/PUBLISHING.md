# Publishing Guide

This guide explains how to publish new versions of the WebSocket client library.

## 🚀 Automated Publishing (Recommended)

### GitHub Release (Preferred)
1. Create a new release on GitHub with a semantic version tag (e.g., `v0.0.15`)
2. The release workflow will automatically:
   - Run tests and build
   - Publish to npm
   - Update changelog
   - Create GitHub release notes

### Push to Master
Publishing happens automatically when you push to the `master` branch:
- Tests must pass
- Build must succeed
- Publishes with current version in `package.json`

## 🛠️ Manual Publishing

### Quick Commands

```bash
# Check current version
yarn version:check

# Dry run (see what would be published)
yarn publish:dry

# Publish beta version
yarn publish:beta

# Publish next version  
yarn publish:next

# Manual interactive publishing
yarn release:manual
```

### Step-by-Step Manual Process

1. **Ensure you're on master and up to date:**
   ```bash
   git checkout master
   git pull origin master
   ```

2. **Run full test suite:**
   ```bash
   yarn test:coverage
   ```

3. **Update version (choose one):**
   ```bash
   yarn version:patch  # 0.0.14 → 0.0.15
   yarn version:minor  # 0.0.14 → 0.1.0  
   yarn version:major  # 0.0.14 → 1.0.0
   ```

4. **Publish:**
   ```bash
   yarn release:manual  # Interactive script
   # OR
   yarn release        # Direct publish
   ```

5. **Push version commit and tag:**
   ```bash
   git push origin master --tags
   ```

## 🔒 Prerequisites

### NPM Authentication
```bash
npm login
# OR set NPM_TOKEN environment variable
export NPM_TOKEN=your_npm_token
```

### Required Secrets (for CI)
- `NPM_TOKEN` - NPM authentication token
- `CODECOV_TOKEN` - Code coverage reporting

## 📋 Pre-Publish Checklist

The `prepublishOnly` script automatically runs:
- ✅ Clean previous build (`yarn clean`)
- ✅ Lint and format check (`yarn check`)  
- ✅ Full test suite (`yarn test`)
- ✅ Production build (`yarn build`)

## 🎯 Publishing Tags

- `latest` (default) - Stable releases
- `beta` - Beta releases (`yarn publish:beta`)
- `next` - Next/experimental releases (`yarn publish:next`)

## 🐛 Troubleshooting

### Common Issues

1. **Version already exists:**
   ```bash
   yarn version:patch  # Bump version first
   ```

2. **Tests failing:**
   ```bash
   yarn test:coverage  # Fix failing tests
   ```

3. **Build errors:**
   ```bash
   yarn clean && yarn build  # Clean rebuild
   ```

4. **Authentication issues:**
   ```bash
   npm login  # Re-authenticate
   ```

### Emergency Unpublish
```bash
# Only within 24 hours of publishing
npm unpublish js-websocket-reconnect-client@0.0.15
```

## 📊 Post-Publish Verification

1. **Check npm:**
   ```bash
   npm view js-websocket-reconnect-client
   ```

2. **Test installation:**
   ```bash
   npm install js-websocket-reconnect-client@latest
   ```

3. **Verify GitHub release:** Check releases page for automated release

4. **Monitor downloads:** Check npm package page for download stats

## ⚠️ Important Notes

### Protected Branch Policy
- **Master branch is protected** and requires pull requests for all changes
- The automated release workflow only creates Git tags - it doesn't modify master directly
- Version bumps should be done manually through pull requests when needed
- All package publishing is automated through GitHub Actions once releases are triggered

### Security Requirements
- Repository requires `NPM_TOKEN` secret for automated publishing
- `CODECOV_TOKEN` is needed for coverage reporting in pull requests
- All releases are automatically tagged and documented