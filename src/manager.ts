import AppGlobal = PixelPerfectDesktop.AppGlobal;

const globalObj: AppGlobal = <any>global;

let moved = 0;

function setWindowPosition(x: number, y: number) {

    const window = globalObj.window;

    const curPos = window.getPosition();

    window.setPosition(curPos[0] + x, curPos[1] + y);
}

export function init() {
    globalObj.setWindowPosition = setWindowPosition;
}
