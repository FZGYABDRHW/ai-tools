// Runs a trivial Electron window to sanity-check the X stack
const { app, BrowserWindow } = require("electron");
function create() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(
    "data:text/html,<h1>Hello from Electron in Dev Container ✨</h1>"
  );
}
app.whenReady().then(create);
