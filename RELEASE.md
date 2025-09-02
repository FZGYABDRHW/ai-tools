# Release Process Guide

This document explains how to create releases for Wowworks AI Tools using the automated release script.

## 🚀 Quick Start

### Automatic Release (Recommended)
```bash
npm run release
```
This will:
1. Auto-increment the patch version
2. Build the macOS application
3. Create a GitHub release
4. Upload the `latest-mac.yml` file for auto-updates

### Manual Version Release
```bash
npm run release:version 1.1.0
```
This allows you to specify a specific version number.

### Build Only (No Release)
```bash
npm run release:build
```
This builds the app without creating a GitHub release.

## 📋 Prerequisites

Before using the release script, ensure you have:

1. **GitHub CLI installed and authenticated**
   ```bash
   # Install GitHub CLI
   brew install gh
   
   # Authenticate
   gh auth login
   ```

2. **All changes committed to git**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **You're on the main branch**
   ```bash
   git checkout main
   ```

## 🔧 Manual Release Process

If you prefer to do releases manually, here's the step-by-step process:

### 1. Update Version
```bash
npm version patch  # or minor, major
```

### 2. Build Application
```bash
npm run make:mac
```

### 3. Create GitHub Release
```bash
gh release create v1.0.14 \
  --title "Wowworks AI Tools v1.0.14" \
  --notes "Release notes here" \
  "out/make/Wowworks AI Tools-1.0.14-arm64.dmg" \
  "out/make/zip/darwin/arm64/Wowworks AI Tools-darwin-arm64-1.0.14.zip"
```

### 4. Create latest-mac.yml
```bash
# Get file sizes and hashes
DMG_SIZE=$(stat -f%z "out/make/Wowworks AI Tools-1.0.14-arm64.dmg")
ZIP_SIZE=$(stat -f%z "out/make/zip/darwin/arm64/Wowworks AI Tools-darwin-arm64-1.0.14.zip")
DMG_SHA512=$(shasum -a 512 "out/make/Wowworks AI Tools-1.0.14-arm64.dmg" | cut -d' ' -f1)
ZIP_SHA512=$(shasum -a 512 "out/make/zip/darwin/arm64/Wowworks AI Tools-darwin-arm64-1.0.14.zip" | cut -d' ' -f1)

# Create latest-mac.yml
cat > latest-mac.yml << EOF
version: 1.0.14
files:
  - url: Wowworks.AI.Tools-1.0.14-arm64.dmg
    sha512: $DMG_SHA512
    size: $DMG_SIZE
  - url: Wowworks.AI.Tools-darwin-arm64-1.0.14.zip
    sha512: $ZIP_SHA512
    size: $ZIP_SIZE
path: Wowworks.AI.Tools-darwin-arm64-1.0.14.zip
sha512: $ZIP_SHA512
releaseDate: '$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'
EOF
```

### 5. Upload latest-mac.yml
```bash
gh release upload v1.0.14 latest-mac.yml --clobber
```

### 6. Push Tags
```bash
git push --tags
```

## ⚠️ Important Notes

### Filename Handling
GitHub automatically converts spaces to dots in asset filenames:
- **Local file**: `Wowworks AI Tools-1.0.14-arm64.dmg`
- **GitHub asset**: `Wowworks.AI.Tools-1.0.14-arm64.dmg`

The `latest-mac.yml` file must use the **GitHub asset names** (with dots), not the local filenames (with spaces).

### Auto-Updater Requirements
For the auto-updater to work properly, the `latest-mac.yml` file must:
1. Be uploaded to the GitHub release
2. Have correct filenames (with dots, not spaces)
3. Include both DMG and ZIP files
4. Have accurate SHA512 hashes and file sizes
5. Point to the ZIP file in the `path` field

## 🐛 Troubleshooting

### Common Issues

1. **404 Error on Update Download**
   - Check that `latest-mac.yml` uses correct filenames (with dots)
   - Verify the file is uploaded to the GitHub release
   - Ensure SHA512 hashes match the actual files

2. **Build Failures**
   - Run `npm install` to ensure dependencies are up to date
   - Check for TypeScript compilation errors
   - Verify webpack configuration

3. **GitHub CLI Issues**
   - Run `gh auth status` to check authentication
   - Use `gh auth login` to re-authenticate if needed

### Debug Mode
The release script includes comprehensive logging. Check the console output for detailed information about each step.

## 📚 Script Options

```bash
./scripts/release.sh --help
```

Available options:
- `--auto-version`: Automatically increment patch version
- `--version VERSION`: Specify exact version number
- `--build-only`: Build without creating release
- `--help`: Show usage information

## 🔄 Release Flow

1. **Development** → Make changes and commit
2. **Release** → Run `npm run release`
3. **Build** → Script builds macOS application
4. **GitHub** → Creates release with assets
5. **Auto-Update** → Uploads `latest-mac.yml`
6. **Users** → Can update via auto-updater

## 📝 Release Notes

Consider creating a `CHANGELOG.md` file to track changes:

```markdown
# Changelog

## [1.0.14] - 2025-09-02
### Added
- New feature description

### Fixed
- Bug fix description

### Changed
- Change description
```

The release script will automatically extract release notes from this file if it exists.
