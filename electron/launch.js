const { spawn } = require("node:child_process");
const path = require("node:path");

const electronPath = require("electron");
const root = path.join(__dirname, "..");
const env = { ...process.env };

delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, ["."], {
  cwd: root,
  env,
  stdio: "inherit",
  windowsHide: false
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
