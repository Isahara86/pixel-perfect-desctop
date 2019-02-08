import {app, BrowserWindow} from 'electron';
import {init} from "./src/manager";
import AppGlobal = PixelPerfectDesktop.AppGlobal;

const globalObj: AppGlobal = <any>global;

app.on('ready', start);

function start() {
    const window = new BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
    });

    window.loadURL(`file://${__dirname}/UI/index.html`);

    window.webContents.on('did-finish-load', function () {
        window.webContents.openDevTools();
    });

    window.on("closed", () => {
        process.exit();
    });

    globalObj.window = window;

    init();
}


