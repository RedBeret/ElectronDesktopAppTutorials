// Import necessary modules from the Electron library
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// When the Electron application is ready
app.on('ready', () => {
    console.log('App is ready');
    
    // Create the main application window
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    
    // Ensure the entire app quits when the main window is closed
    mainWindow.on('closed', () => app.quit());
    console.log('Loaded main.html');

    // Create the application menu from the template defined below
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
    console.log('Menu set');
});

// Function to create the 'Add Todo' window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    
    // Ensure the addWindow variable is set to null when the window is closed
    addWindow.on('closed', () => addWindow = null);
}

// Listen for 'todo:add' events from the renderer process (add.html)
ipcMain.on('todo:add', (event, todo) => {
    console.log("Received todo:add in main process.");
    
    // Forward the todo item to the main window to be displayed
    mainWindow.webContents.send('todo:add', todo);
    
    // Close the 'Add Todo' window
    addWindow.close();
});

const menuTemplate = [];

// Check if the application is running on a Mac
// If so, add an initial menu item for the app name
if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: app.name,  // This will display the app's name
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });
}

// Add the 'File' menu with options to create a new todo and quit the application
menuTemplate.push({
    label: 'File',
    submenu: [
        { label: 'New Todo', click: createAddWindow },
        { label: 'Quit', 
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click: app.quit 
        }
    ]
});

// If the application is not in production, add a 'View' menu for development tools
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.webContents.toggleDevTools();
                    }
                }
            }
        ]
    });
}
