"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
}
exports.init = init;
