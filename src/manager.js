"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globalObj = global;
let moved = 0;
function setWindowPosition(x, y) {
    const window = globalObj.window;
    const curPos = window.getPosition();
    window.setPosition(curPos[0] + x, curPos[1] + y);
}
function init() {
    globalObj.setWindowPosition = setWindowPosition;
}
exports.init = init;
