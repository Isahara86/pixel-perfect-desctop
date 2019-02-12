"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const settings_module_1 = __importDefault(require("./settings.module"));
const globalObj = global;
function setWindowPosition(x, y) {
    const window = globalObj.window;
    const curPos = window.getPosition();
    window.setPosition(curPos[0] + x, curPos[1] + y);
}
function minimize() {
    const window = globalObj.window;
    window.minimize();
}
function close() {
    const window = globalObj.window;
    window.close();
}
function init() {
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.settingsModule = settings_module_1.default;
}
exports.init = init;
