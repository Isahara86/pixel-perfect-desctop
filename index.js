"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const manager_1 = require("./src/manager");
const globalObj = global;
electron_1.app.on('ready', start);
function start() {
    const window = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
    });
    window.loadURL(`file://${__dirname}/UI/index.html`);
    // window.webContents.on('did-finish-load', function () {
    //     window.webContents.openDevTools();
    // });
    window.on("closed", () => {
        process.exit();
    });
    globalObj.window = window;
    manager_1.init();
}
