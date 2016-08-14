var electron = require('electron')
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// Without a default menu copy/paste does not work on OSX
var defaultMenuTemplate = [{
	label: "Application",
	submenu: [
		{ label: "About Application", selector: "orderFrontStandardAboutPanel:" },
		{ type: "separator" },
		{ label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
	]}, {
	label: "Edit",
	submenu: [
		{ label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
		{ label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
		{ type: "separator" },
		{ label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
		{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
		{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
		{ label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
	]}
];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(defaultMenuTemplate));

    mainWindow = new BrowserWindow({width: 1000, height: 800});
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});
