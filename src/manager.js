"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_module_1 = __importDefault(require("./store.module"));
const electron_1 = require("electron");
const globalObj = global;
let browserWindow;
function setWindowPosition(x, y) {
    const curPos = browserWindow.getPosition();
    browserWindow.setPosition(curPos[0] + x, curPos[1] + y);
}
function minimize() {
    browserWindow.minimize();
}
function close(uiState) {
    saveState(uiState, () => browserWindow.close());
}
function saveState(uiState, cb) {
    const windowBounds = browserWindow.getBounds();
    store_module_1.default.setSettings({ windowBounds, uiState }, cb);
}
function createWindow() {
    const windowBounds = store_module_1.default.getSettings().windowBounds;
    const window = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        minHeight: 550,
        minWidth: 550,
        show: false,
        width: windowBounds.width,
        height: windowBounds.height,
        x: windowBounds.x,
        y: windowBounds.y,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    window.loadURL(`file://${__dirname}/UI/index.html`);
    window.on("closed", () => {
        process.exit();
    });
    return window;
}
function init() {
    browserWindow = createWindow();
    globalObj.managerGlobal = {
        setWindowPosition,
        minimize,
        close,
        storeModule: store_module_1.default,
    };
    browserWindow.webContents.once('did-finish-load', () => {
        browserWindow.show();
        if (!store_module_1.default.isProd) {
            browserWindow.webContents.openDevTools();
        }
    });
}
exports.init = init;
//# sourceMappingURL=manager.js.map