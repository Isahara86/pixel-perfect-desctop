"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const manager_1 = require("./src/manager");
electron_1.app.on('ready', start);
function start() {
    const window = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        minHeight: 250,
        minWidth: 250,
        show: false,
    });
    window.loadURL(`file://${__dirname}/UI/index.html`);
    window.on("closed", () => {
        process.exit();
    });
    manager_1.init(window);
}
