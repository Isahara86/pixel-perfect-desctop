"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_module_1 = __importDefault(require("./store.module"));
const globalObj = global;
let window;
function setWindowPosition(x, y) {
    const curPos = window.getPosition();
    window.setPosition(curPos[0] + x, curPos[1] + y);
}
function minimize() {
    const window = globalObj.window;
    window.minimize();
}
function close() {
    saveState()
        .then(() => globalObj.window.close());
}
function saveState() {
    const bounds = window.getBounds();
    const contentBounds = window.getContentBounds();
    console.log(bounds);
    console.log(contentBounds);
    return window.webContents
        .executeJavaScript('getScrollPosition();')
        .then((scrollData) => {
        console.log(scrollData);
        store_module_1.default.saveWindowState({ windowBounds: bounds, scrollData });
    });
}
function loadWindowState() {
    const settings = store_module_1.default.getSettings();
    if (settings.windowBounds) {
        window.setBounds(settings.windowBounds);
    }
    if (settings.scrollData) {
        window.webContents
            .executeJavaScript(`setScroll(${JSON.stringify(settings.scrollData)});`);
    }
}
function init(newWindow) {
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.storeModule = store_module_1.default;
    globalObj.window = newWindow;
    window = newWindow;
    window.webContents.on('did-finish-load', () => {
        loadWindowState();
        window.show();
        window.webContents.openDevTools();
    });
}
exports.init = init;
