#!/bin/bash

# Post-create script for Wowworks AI Tools devcontainer
set -e

echo "🚀 Setting up Wowworks AI Tools development environment..."

# Ensure we're in the right directory
cd /workspaces/ai-tools

# Ensure we're running as vscode user
if [ "$(whoami)" != "vscode" ]; then
    echo "⚠️  This script should be run as vscode user, but running as $(whoami)"
fi

# Ensure .npmrc is configured for legacy peer deps
echo "⚙️  Configuring npm for legacy peer deps..."
if [ ! -f ".npmrc" ] || ! grep -q "legacy-peer-deps" .npmrc; then
    echo "legacy-peer-deps=true" >> .npmrc
    echo "✅ Added legacy-peer-deps=true to .npmrc"
else
    echo "✅ .npmrc already configured for legacy peer deps"
fi

# Set up display environment for Electron
echo "🖥️  Setting up display environment for Electron..."
export DISPLAY=${DISPLAY:-:0}
echo "export DISPLAY=${DISPLAY}" >> ~/.bashrc

# Install and configure virtual display for headless environment
echo "🖥️  Setting up virtual display for headless environment..."
sudo apt-get update && sudo apt-get install -y xvfb dbus-x11
echo "export ELECTRON_DISABLE_SANDBOX=1" >> ~/.bashrc
echo "export ELECTRON_NO_SANDBOX=1" >> ~/.bashrc
echo "export ELECTRON_DISABLE_GPU=1" >> ~/.bashrc
echo "export ELECTRON_DISABLE_GPU_SANDBOX=1" >> ~/.bashrc
echo "export ELECTRON_DISABLE_GPU_PROCESS_CRASH_LIMIT=1" >> ~/.bashrc
echo "export DISPLAY=:99" >> ~/.bashrc

# Start D-Bus service
echo "🔧 Starting D-Bus service..."
sudo service dbus start

# Start virtual display server
echo "🖥️  Starting virtual display server..."
Xvfb :99 -screen 0 1024x768x24 &
echo "✅ Display environment configured with virtual display support"

# Install system dependencies for Electron
echo "🔧 Installing Electron system dependencies..."
sudo apt-get update && sudo apt-get install -y \
    libnss3-dev \
    libatk-bridge2.0-dev \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libxtst6 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    && sudo rm -rf /var/lib/apt/lists/*

# Fix Electron sandbox permissions and configure for containerized environment
echo "🔧 Configuring Electron for containerized environment..."
if [ -f "node_modules/electron/dist/chrome-sandbox" ]; then
    sudo chown root:root node_modules/electron/dist/chrome-sandbox
    sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
    echo "✅ Electron sandbox permissions fixed"
else
    echo "⚠️  Electron sandbox not found, will be fixed after npm install"
fi

# Set Electron environment variables for containerized development
echo "export ELECTRON_DISABLE_SANDBOX=1" >> ~/.bashrc
echo "export ELECTRON_NO_SANDBOX=1" >> ~/.bashrc
echo "✅ Electron sandbox disabled for containerized environment"

# Install dependencies if node_modules doesn't exist or is empty
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
    echo "📦 Installing dependencies with legacy peer deps..."
    npm ci --legacy-peer-deps

    # Fix Electron sandbox permissions after install
    echo "🔧 Fixing Electron sandbox permissions after install..."
    if [ -f "node_modules/electron/dist/chrome-sandbox" ]; then
        sudo chown root:root node_modules/electron/dist/chrome-sandbox
        sudo chmod 4755 node_modules/electron/dist/chrome-sandbox
        echo "✅ Electron sandbox permissions fixed"
    fi
else
    echo "📦 Dependencies already installed, skipping..."
fi

# Set up git configuration if not already set
if [ -z "$(git config --global user.name)" ]; then
    echo "⚙️  Setting up git configuration..."
    git config --global user.name "DevContainer User"
    git config --global user.email "devcontainer@example.com"
fi

# Create useful aliases
echo "🔧 Setting up development aliases..."
cat >> ~/.bashrc << 'EOF'

# Development aliases
alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias npm-run='npm run'
alias npm-start='npm start'
alias npm-test='npm test'
alias npm-lint='npm run lint'
alias npm-build='npm run build'

# Electron development aliases
alias electron-dev='npm start'
alias electron-build='npm run make'
alias electron-package='npm run package'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'
alias gd='git diff'

# Project specific aliases
alias ai-tools='cd /workspaces/ai-tools'
alias src='cd /workspaces/ai-tools/src'
alias components='cd /workspaces/ai-tools/src/components'
alias services='cd /workspaces/ai-tools/src/services'

EOF

# Set up VS Code settings for better development experience
echo "🎨 Setting up VS Code workspace settings..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "files.associations": {
    "*.tsx": "typescriptreact",
    "*.ts": "typescript"
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.webpack": true,
    "**/out": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.webpack": true,
    "**/out": true
  }
}
EOF

# Create launch configuration for debugging
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Electron Main",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": [".webpack/main"],
      "outputCapture": "std"
    },
    {
      "name": "Debug Electron Renderer",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
EOF

# Create tasks configuration
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "npm: start",
      "type": "shell",
      "command": "npm start",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "npm: lint",
      "type": "shell",
      "command": "npm run lint",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": ["$eslint-stylish"]
    },
    {
      "label": "npm: build",
      "type": "shell",
      "command": "npm run make",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    }
  ]
}
EOF

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm start          - Start the Electron application"
echo "  npm run lint       - Run ESLint"
echo "  npm run make       - Build the application"
echo "  npm run package    - Package the application"
echo ""
echo "🔧 Available aliases:"
echo "  electron-dev       - Start development server"
echo "  electron-build     - Build the application"
echo "  gs                 - Git status"
echo "  ll                 - List files with details"
echo ""
echo "🚀 Happy coding!"
