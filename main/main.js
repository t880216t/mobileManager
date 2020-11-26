import electron, { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
} from 'electron-devtools-installer';

const {device_watch, listDevices, initSystem} = require('./android/init')

let mainWindow = null;

const fileURL = path.join('file:', __dirname, 'index.html');
const winURL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : new URL(fileURL).href;

function createWindow() {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    width: Math.ceil(width * 0.8),
    height: Math.ceil(height * 0.8),
    center: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false,
      preload: path.resolve(__dirname, 'preload.js'),
    },
    frame: true
  });

  mainWindow.loadURL(winURL);
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-finish-load', function () {
    initSystem()
    device_watch(mainWindow.webContents)
  })

  ipcMain.on('toMain', function(event, common, message) {
    if (common === 'refresh') {
      listDevices(mainWindow.webContents)
    }
  });

  mainWindow.on('close', () => {
    ipcMain.removeAllListeners('connect')
    ipcMain.removeAllListeners('disconnect')
  })

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  devtoolsInstall();
  createWindow();
});

function devtoolsInstall() {
  if (process.env.NODE_ENV !== 'development') return;
  installExtension(REACT_DEVELOPER_TOOLS);
  installExtension(REDUX_DEVTOOLS);
  installExtension(REACT_PERF);
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
