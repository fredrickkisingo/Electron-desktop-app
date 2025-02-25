const electron  = require('electron');
const url = require('url');
const path  = require('path')

const {app, BrowserWindow, Menu} = electron;

let mainWindow ;
let addWindow;
//Listen for app to be ready
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        widht:200,
        height:300,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ✅ Use secure preload script
            contextIsolation: true,
            enableRemoteModule: false, 
            nodeIntegration: false, // 🚫 Don't enable `require` in renderer directly
        }
    });
    //LOad html file into window

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }));


    //Quit app when closed 
    mainWindow.on('closed',function(){
        app.quit();
    })
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
});


//handle create add window 

function createAddWindow(){
    addWindow = new BrowserWindow({
        widht:300,
        height:200,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // ✅ Use secure preload script
            contextIsolation: true,
            enableRemoteModule: false, 
            nodeIntegration: false, // 🚫 Don't enable `require` in renderer directly
        }
        
    });
    //LOad html file into window

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol:'file:',
        slashes:true
    }));

    //Garbage collection handle
    addWindow.on('close',function(){
        addWindow = null;
    })

}
const mainMenuTemplate = [

    {
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                click(){

                    createAddWindow();
                }
            },
            {
                label:'Clear Items'
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];


//if mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                label: 'Toggle DevTools',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}