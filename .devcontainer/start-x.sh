#!/usr/bin/env bash
set -euo pipefail

echo "Container started"
echo "PORT=5900"

# Start virtual display
Xvfb :0 -screen 0 1920x1080x24 -ac +extension RANDR +extension GLX -nolisten tcp &
sleep 0.5

# Lightweight WM for dialogs/menus
fluxbox >/tmp/fluxbox.log 2>&1 &

# Expose X via VNC
x11vnc -display :0 -forever -shared -rfbport 5900 -nopw -o /tmp/x11vnc.log -bg

# noVNC websocket wrapper
if [ -x /usr/share/novnc/utils/novnc_proxy ]; then
  /usr/share/novnc/utils/novnc_proxy --vnc localhost:5900 --listen 0.0.0.0:6080 &
else
  websockify --web=/usr/share/novnc 0.0.0.0:6080 localhost:5900 &
fi

echo "✅ noVNC ready at http://localhost:6080"
# Keep container alive
tail -f /dev/null
