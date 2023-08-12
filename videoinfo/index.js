// Required modules
const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");

const { app, BrowserWindow, ipcMain } = electron;

// Declaring mainWindow variable to keep a global reference of the window object
let mainWindow;

// This event will be called once Electron has done initializing.
app.on("ready", () => {
  // Create a new browser window
  mainWindow = new BrowserWindow({});
  // Load the index.html file into the mainWindow
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

// This event listener waits for a 'video:submit' message from the renderer process
ipcMain.on("video:submit", (event, path) => {
  // Use ffmpeg to extract video metadata
  ffmpeg.ffprobe(path, (err, metadata) => {
    // Send the extracted duration back to the renderer process
    mainWindow.webContents.send("video:metadata", metadata.format.duration);
  });
});
