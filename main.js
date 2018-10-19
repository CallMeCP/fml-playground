// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';

// if (environment.production) {
//   enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.log(err));

const { app, BrowserWindow } = require('electron')

let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1366, 
    height: 768,
    backgroundColor: '#ffffff',
    icon: `file://${__dirname}/dist/fml-builder/assets/logo.png`
  })


  win.loadURL(`file://${__dirname}/dist/fml-builder/index.html`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  })

  win.setMenuBarVisibility(true);
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // macOS specific close process
  if (win === null) {
    createWindow()
  }
})