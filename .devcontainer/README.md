# DevContainer for Wowworks AI Tools

This directory contains the development container configuration for the Wowworks AI Tools Electron application.

## What's Included

- **Node.js 18** - Latest LTS version
- **Electron dependencies** - All system libraries needed for Electron development
- **VS Code extensions** - Pre-configured extensions for TypeScript, React, ESLint, and more
- **Development tools** - Git, curl, wget, vim, nano, htop, tree, jq
- **Pre-configured settings** - VS Code workspace settings, launch configurations, and tasks

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed and running
- [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Using the DevContainer

1. **Open in VS Code**: Open this project in VS Code
2. **Reopen in Container**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Reopen in Container"
   - Select the command and wait for the container to build

3. **First-time setup**: The post-create script will automatically:
   - Install npm dependencies
   - Set up git configuration
   - Create useful aliases
   - Configure VS Code settings

### Available Commands

Once inside the container, you can use these commands:

```bash
# Start the Electron application
npm start

# Run linting
npm run lint

# Build the application
npm run make

# Package the application
npm run package

# Development aliases
electron-dev      # Start development server
electron-build    # Build the application
gs               # Git status
ll               # List files with details
```

### VS Code Integration

The devcontainer includes pre-configured:

- **Launch configurations** for debugging Electron main and renderer processes
- **Tasks** for common npm commands
- **Settings** optimized for TypeScript and React development
- **Extensions** for the best development experience

### Port Forwarding

The following ports are automatically forwarded:
- `3000` - Development server
- `8080` - Webpack dev server
- `9229` - Node.js debugging

### File Structure

```
.devcontainer/
├── devcontainer.json      # Main devcontainer configuration
├── Dockerfile            # Container image definition
├── docker-compose.yml    # Optional services (database, etc.)
├── post-create.sh        # Setup script that runs after container creation
└── README.md            # This file
```

### Troubleshooting

#### Container won't start
- Ensure Docker is running
- Try rebuilding the container: `Ctrl+Shift+P` → "Dev Containers: Rebuild Container"

#### Electron app won't launch
- Make sure you're running `npm start` from the container terminal
- Check that all dependencies are installed: `npm ci`

#### Performance issues
- The container uses volume mounts for better performance
- If you experience slow file watching, you can exclude `node_modules` from VS Code's file watcher

### Customization

You can customize the devcontainer by editing:

- `devcontainer.json` - Add more VS Code extensions, change settings
- `Dockerfile` - Add system packages, change Node.js version
- `post-create.sh` - Add custom setup commands
- `docker-compose.yml` - Add additional services like databases

### Additional Services

The `docker-compose.yml` file includes commented examples for:
- PostgreSQL database
- Redis cache

Uncomment and modify as needed for your development requirements.

## Support

If you encounter any issues with the devcontainer setup, please check:
1. Docker is running and accessible
2. VS Code Dev Containers extension is installed
3. Container logs for any error messages
4. Network connectivity for downloading dependencies








