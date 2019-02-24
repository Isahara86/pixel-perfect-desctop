"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_module_1 = __importDefault(require("./store.module"));
const electron_1 = require("electron");
const globalObj = global;
let window;
function setWindowPosition(x, y) {
    const curPos = window.getPosition();
    window.setPosition(curPos[0] + x, curPos[1] + y);
}
function minimize() {
    window.minimize();
}
function close(uiState) {
    saveState(uiState, () => window.close());
}
function saveState(uiState, cb) {
    const windowBounds = window.getBounds();
    store_module_1.default.setSettings({ windowBounds, uiState }, cb);
}
function createWindow() {
    const windowBounds = store_module_1.default.getSettings().windowBounds;
    const window = new electron_1.BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        minHeight: 500,
        minWidth: 500,
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
    window = createWindow();
    globalObj.window = window;
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.storeModule = store_module_1.default;
    window.webContents.once('did-finish-load', () => {
        window.show();
        if (!store_module_1.default.isProd) {
            window.webContents.openDevTools();
        }
    });
}
exports.init = init;
//# sourceMappingURL=manager.js.map