FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

# X stack + noVNC + useful Electron deps
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    xvfb x11vnc fluxbox novnc websockify x11-apps \
    libgtk-3-0 libnss3 libasound2 libxss1 libxtst6 libxkbcommon0 \
    libxkbcommon-x11-0 libdrm2 libgbm1 libxshmfence1 libxrandr2 libxfixes3 \
    libxdamage1 libxcomposite1 libxrender1 libxcursor1 libxi6 \
    libatk1.0-0 libatk-bridge2.0-0 libcups2 libpango-1.0-0 libpangocairo-1.0-0 \
    ca-certificates git sudo && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Create vscode user if it doesn't exist
RUN if ! id vscode >/dev/null 2>&1; then \
        useradd -m -s /bin/bash vscode; \
    fi

# Add vscode user to sudoers for post-create script
RUN echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Copy and set up scripts
COPY .devcontainer/start-x.sh /usr/local/bin/start-x.sh
COPY .devcontainer/post-create.sh /usr/local/bin/post-create.sh
RUN chmod +x /usr/local/bin/start-x.sh /usr/local/bin/post-create.sh

# Set up proper permissions for vscode user
USER vscode
WORKDIR /workspaces/ai-tools

# IMPORTANT: devcontainers default to override CMD; our devcontainer.json sets overrideCommand=false
CMD ["/usr/local/bin/start-x.sh"]
