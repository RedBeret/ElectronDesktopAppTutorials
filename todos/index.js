const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
        console.log('App is ready');
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.on('closed', () => app.quit());
    console.log('Loaded main.html');


    const mainMenu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(mainMenu);
        console.log('Menu set');

});

function createAddWindow () {
    addWindow = new BrowserWindow ({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
addWindow.loadURL(`file://${__dirname}/add.html`);
}


const menuTemplate = [

    {
        label: 'File',
        submenu: [
            { label:'New Todo', 
            click() {createAddWindow();} 
            },
            { label: 'Quit', 
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q', /* accelerator replaced the below command they are = to each other */
                       /* old command not optimized    
                (() => { return              
                    if (process.platform === 'darwin') {
                        return 'Command+Q'
                    } else { 
                        return 'Ctrl+Q'; 
                        
                        (process.platform === 'win32') {}
                })(), }*/
                click(){
                    app.quit(); 
                },
            }
        ]
    }
];  

if (process.platform === 'win32') {
    menuTemplate.unshift({
    label: electron.app.name,
    submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
    ]
});
}
if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View'
        submenu: [
            {
                label: 'Toggle Developer Tools',
                click(item, focusWindow) {
                    
                }
            }
    })
}
