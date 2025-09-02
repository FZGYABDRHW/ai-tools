#!/bin/bash

# Wowworks AI Tools Release Script
# This script automates the entire release process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="FZGYABDRHW"
REPO_NAME="ai-tools"
APP_NAME="Wowworks AI Tools"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed. Please install it first."
        exit 1
    fi
    
    # Check if gh is authenticated
    if ! gh auth status &> /dev/null; then
        print_error "GitHub CLI is not authenticated. Please run 'gh auth login' first."
        exit 1
    fi
    
    # Check if we're on main branch
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        print_warning "Current branch is '$CURRENT_BRANCH', not 'main'. Continue anyway? (y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_status "Aborting release."
            exit 1
        fi
    fi
    
    print_success "Prerequisites check passed."
}

# Function to get current version
get_current_version() {
    node -p "require('./package.json').version"
}

# Function to get next version
get_next_version() {
    CURRENT_VERSION=$(get_current_version)
    IFS='.' read -ra VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR="${VERSION_PARTS[0]}"
    MINOR="${VERSION_PARTS[1]}"
    PATCH="${VERSION_PARTS[2]}"
    NEW_PATCH=$((PATCH + 1))
    echo "$MAJOR.$MINOR.$NEW_PATCH"
}

# Function to build the application
build_app() {
    print_status "Building macOS application..."
    
    # Clean previous builds
    if [ -d "out" ]; then
        print_status "Cleaning previous builds..."
        rm -rf out
    fi
    
    # Build the app
    npm run make:mac
    
    if [ $? -eq 0 ]; then
        print_success "Application built successfully."
    else
        print_error "Build failed."
        exit 1
    fi
}

# Function to create latest-mac.yml
create_latest_mac_yml() {
    local VERSION=$1
    local DMG_FILE=""
    local ZIP_FILE=""
    
    print_status "Creating latest-mac.yml for version $VERSION..."
    
    # Find the DMG and ZIP files
    DMG_FILE=$(find out/make -name "*.dmg" -type f | head -1)
    ZIP_FILE=$(find out/make -name "*.zip" -type f | head -1)
    
    if [ -z "$DMG_FILE" ] || [ -z "$ZIP_FILE" ]; then
        print_error "Could not find DMG or ZIP files in out/make directory."
        exit 1
    fi
    
    print_status "Found DMG: $DMG_FILE"
    print_status "Found ZIP: $ZIP_FILE"
    
    # Get file sizes
    DMG_SIZE=$(stat -f%z "$DMG_FILE")
    ZIP_SIZE=$(stat -f%z "$ZIP_FILE")
    
    # Get SHA512 hashes
    DMG_SHA512=$(shasum -a 512 "$DMG_FILE" | cut -d' ' -f1)
    ZIP_SHA512=$(shasum -a 512 "$ZIP_FILE" | cut -d' ' -f1)
    
    # Extract filenames (GitHub converts spaces to dots)
    DMG_FILENAME=$(basename "$DMG_FILE" | sed 's/ /./g')
    ZIP_FILENAME=$(basename "$ZIP_FILE" | sed 's/ /./g')
    
    # Create latest-mac.yml
    cat > "latest-mac.yml" << EOF
version: $VERSION
files:
  - url: $DMG_FILENAME
    sha512: $DMG_SHA512
    size: $DMG_SIZE
  - url: $ZIP_FILENAME
    sha512: $ZIP_SHA512
    size: $ZIP_SIZE
path: $ZIP_FILENAME
sha512: $ZIP_SHA512
releaseDate: '$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'
EOF
    
    print_success "latest-mac.yml created successfully."
    print_status "DMG: $DMG_FILENAME (${DMG_SIZE} bytes)"
    print_status "ZIP: $ZIP_FILENAME (${ZIP_SIZE} bytes)"
}

# Function to create GitHub release
create_github_release() {
    local VERSION=$1
    local DMG_FILE=""
    local ZIP_FILE=""
    
    print_status "Creating GitHub release v$VERSION..."
    
    # Find the DMG and ZIP files
    DMG_FILE=$(find out/make -name "*.dmg" -type f | head -1)
    ZIP_FILE=$(find out/make -name "*.zip" -type f | head -1)
    
    if [ -z "$DMG_FILE" ] || [ -z "$ZIP_FILE" ]; then
        print_error "Could not find DMG or ZIP files in out/make directory."
        exit 1
    fi
    
    # Create release notes
    local RELEASE_NOTES=""
    if [ -f "CHANGELOG.md" ]; then
        RELEASE_NOTES=$(awk -v version="$VERSION" '
            /^## \['"$VERSION"'\]/ {p=1; next}
            /^## \[/ {p=0}
            p {print}
        ' CHANGELOG.md | sed '/^$/d')
    fi
    
    if [ -z "$RELEASE_NOTES" ]; then
        RELEASE_NOTES="Release v$VERSION of $APP_NAME

- Auto-updater fixes and improvements
- Smart Automatic updates working
- Object cloning errors resolved
- Ready for testing the complete update flow"
    fi
    
    # Create the release
    gh release create "v$VERSION" \
        --title "$APP_NAME v$VERSION" \
        --notes "$RELEASE_NOTES" \
        "$DMG_FILE" \
        "$ZIP_FILE"
    
    if [ $? -eq 0 ]; then
        print_success "GitHub release v$VERSION created successfully."
    else
        print_error "Failed to create GitHub release."
        exit 1
    fi
}

# Function to upload latest-mac.yml
upload_latest_mac_yml() {
    local VERSION=$1
    
    print_status "Uploading latest-mac.yml to release v$VERSION..."
    
    gh release upload "v$VERSION" "latest-mac.yml" --clobber
    
    if [ $? -eq 0 ]; then
        print_success "latest-mac.yml uploaded successfully."
    else
        print_error "Failed to upload latest-mac.yml."
        exit 1
    fi
}

# Function to clean up
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f latest-mac.yml
    print_success "Cleanup completed."
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -v, --version VERSION    Specify version to release (e.g., 1.0.14)"
    echo "  -a, --auto-version       Automatically increment patch version"
    echo "  -b, --build-only         Only build the app, don't create release"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --auto-version        # Auto-increment and release"
    echo "  $0 --version 1.1.0       # Release specific version"
    echo "  $0 --build-only          # Just build, no release"
}

# Main script
main() {
    local VERSION=""
    local AUTO_VERSION=false
    local BUILD_ONLY=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -v|--version)
                VERSION="$2"
                shift 2
                ;;
            -a|--auto-version)
                AUTO_VERSION=true
                shift
                ;;
            -b|--build-only)
                BUILD_ONLY=true
                shift
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
    
    # Check prerequisites
    check_prerequisites
    
    # Determine version
    if [ -z "$VERSION" ]; then
        if [ "$AUTO_VERSION" = true ]; then
            VERSION=$(get_next_version)
            print_status "Auto-detected next version: $VERSION"
        else
            print_error "Please specify a version with --version or use --auto-version."
            show_usage
            exit 1
        fi
    fi
    
    print_status "Starting release process for version $VERSION..."
    
    # Build the application
    build_app
    
    if [ "$BUILD_ONLY" = true ]; then
        print_success "Build completed. Skipping release creation."
        exit 0
    fi
    
    # Create latest-mac.yml
    create_latest_mac_yml "$VERSION"
    
    # Create GitHub release
    create_github_release "$VERSION"
    
    # Upload latest-mac.yml
    upload_latest_mac_yml "$VERSION"
    
    # Clean up
    cleanup
    
    print_success "Release v$VERSION completed successfully!"
    print_status "Users can now update to v$VERSION using the auto-updater."
}

# Run main function with all arguments
main "$@"
