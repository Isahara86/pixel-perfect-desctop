import AppGlobal = PixelPerfectDesktop.AppGlobal;
import settingsModule from './settings.module';

const globalObj: AppGlobal = <any>global;

function setWindowPosition(x: number, y: number) {

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

export function init() {
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.settingsModule = settingsModule;
}
