// Importing required modules from Electron
const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

// App is ready to start
app.on('ready', () => {
    // Creating the main BrowserWindow
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // If main window is closed, quit the app
    mainWindow.on('closed', () => app.quit());

    // Setting up the application menu from the menu template
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

// Function to create the 'Add Todo' window
function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

// Listening for the 'todo:add' event from renderer process
ipcMain.on('todo:add', (event, todo) => {
    // Sending the todo item to the main window
    mainWindow.webContents.send('todo:add', todo);
    // Close the 'Add Todo' window after adding a todo
    addWindow.close();
});

// Menu template for the application
const menuTemplate = [
    // Common File menu
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    // Creating the 'Add Todo' window on click
                    createAddWindow();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    // Quitting the app
                    app.quit();
                }
            }
        ]
    }
];

// If the app is running on macOS, ensure the app menu displays correctly
if (process.platform === 'darwin') {
    menuTemplate.unshift({
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });
}

// If not in production, add developer tools options
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            { role: 'reload' },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    // Toggle the developer tools for the focused window
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}
