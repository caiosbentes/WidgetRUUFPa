var menubar = require('menubar')
var getRu = require('./ru')
var ipc = require("electron").ipcMain

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;




var mb = menubar({ width: 200, height: 500})

mb.on('after-create-window', function() {
  // mb.window.setResizable(false);
  // mb.window.openDevTools();
});

mb.on('show', function() {
  if (process.platform === 'linux') {
    mb.setOption('x', 1050)
    mb.setOption('y', 300)
  }

});

mb.on('after-show', function() {
  //mb.window.webContents.send('after-show');

        console.log("loaded");
        mb.window.webContents.executeJavaScript("console.log(document.body.innerHTML);");
        getRu((data) => {
          mb.window.webContents.send("from-server", data);
        })

});


mb.on('ready', function ready () {

getRu((data) => {
  console.log(data)
  })

console.log('app is ready')
})


