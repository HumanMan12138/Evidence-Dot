const { app, BrowserWindow, Menu, Tray, nativeImage, shell } = require("electron");
const { startServer } = require("../server");

let mainWindow;
let tray;
let appServer;
let appPort;
let isQuitting = false;

function createAppIcon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="#0f172a"/>
      <path d="M17 18h18c7.2 0 12 4.2 12 10.7 0 4.3-2.1 7.6-5.7 9.2L49 50H38.4l-6.2-10.4h-5.4V50H17V18Zm9.8 8.4v5.6h7.4c2.1 0 3.5-1.1 3.5-2.8s-1.4-2.8-3.5-2.8h-7.4Z" fill="#ffffff"/>
      <circle cx="49" cy="17" r="5" fill="#2d6cdf"/>
    </svg>
  `;
  return nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`);
}

function showWindow() {
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  mainWindow.focus();
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

function buildAppMenu() {
  const template = [
    {
      label: "Evidence Dot",
      submenu: [
        { label: "Open Window", click: showWindow },
        { label: "Hide Window", click: () => mainWindow?.hide() },
        { type: "separator" },
        {
          label: "Open Local URL",
          click: () => {
            if (appPort) shell.openExternal(`http://127.0.0.1:${appPort}`);
          }
        },
        { type: "separator" },
        {
          label: "Quit",
          click: () => {
            isQuitting = true;
            app.quit();
          }
        }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload", label: "Reload" },
        { role: "toggleDevTools", label: "Developer Tools" },
        { type: "separator" },
        { role: "resetZoom", label: "Reset Zoom" },
        { role: "zoomIn", label: "Zoom In" },
        { role: "zoomOut", label: "Zoom Out" }
      ]
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize", label: "Minimize" },
        { role: "close", label: "Close to Tray" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function buildTray(icon) {
  tray = new Tray(icon);
  tray.setToolTip("Evidence Dot - XHS investment evidence assistant");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open Evidence Dot", click: showWindow },
      { label: "Hide Window", click: () => mainWindow?.hide() },
      { type: "separator" },
      {
        label: "Quit",
        click: () => {
          isQuitting = true;
          app.quit();
        }
      }
    ])
  );
  tray.on("click", toggleWindow);
}

async function createWindow() {
  const started = await startServer({ port: 0, host: "127.0.0.1", quiet: true });
  appServer = started.server;
  appPort = started.port;

  const icon = createAppIcon();
  buildTray(icon);
  buildAppMenu();

  mainWindow = new BrowserWindow({
    width: 1320,
    height: 900,
    minWidth: 1040,
    minHeight: 720,
    title: "Evidence Dot",
    backgroundColor: "#f4f6fa",
    icon,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  await mainWindow.loadURL(`http://127.0.0.1:${appPort}`);
}

app.whenReady().then(createWindow);

app.on("activate", showWindow);

app.on("before-quit", () => {
  isQuitting = true;
});

app.on("window-all-closed", () => {
  // Keep the tray process alive until the user chooses Quit.
});

app.on("quit", () => {
  if (appServer) appServer.close();
});
