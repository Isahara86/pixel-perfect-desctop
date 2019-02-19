import AppGlobal = PixelPerfectDesktop.AppGlobal;
import storeModule from './store.module';
import BrowserWindow = Electron.BrowserWindow;

const globalObj: AppGlobal = <any>global;
let window: BrowserWindow;

function setWindowPosition(x: number, y: number) {
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

function saveState(): Promise<void> {
    const bounds = window.getBounds();

    return window.webContents
        .executeJavaScript('getScrollPosition();')
        .then((scrollData: ScrollData) => {
            storeModule.saveWindowState({windowBounds: bounds, scrollData});
        });
}

function loadWindowState() {
    const settings = storeModule.getSettings();

    if (settings.windowBounds) {
        window.setBounds(settings.windowBounds);
    }

    if (settings.scrollData) {
        window.webContents.executeJavaScript(`setScroll(${JSON.stringify(settings.scrollData)});`)
    }
}

export function init(newWindow: BrowserWindow) {
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.storeModule = storeModule;
    globalObj.window = newWindow;

    window = newWindow;

    window.webContents.on('did-finish-load', () => {
        loadWindowState();
        window.show();
        if (!storeModule.isProd) {
            window.webContents.openDevTools();
        }
    });
}
