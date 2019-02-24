import AppGlobal = PixelPerfectDesktop.AppGlobal;
import storeModule from './store.module';
import {BrowserWindow} from 'electron';

const globalObj: AppGlobal = <any>global;
let window: BrowserWindow;

function setWindowPosition(x: number, y: number) {
    const curPos = window.getPosition();
    window.setPosition(curPos[0] + x, curPos[1] + y);
}

function minimize() {
    window.minimize();
}

function close(uiState: UIState) {
    saveState(uiState, () => window.close());
}

function saveState(uiState: UIState, cb: any) {
    const windowBounds = window.getBounds();
    storeModule.setSettings({windowBounds, uiState}, cb);
}

function createWindow(): BrowserWindow {
    const windowBounds = storeModule.getSettings().windowBounds;

    const window = new BrowserWindow({
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

    return window
}

export function init() {
    window = createWindow();
    globalObj.window = window;
    globalObj.setWindowPosition = setWindowPosition;
    globalObj.minimize = minimize;
    globalObj.close = close;
    globalObj.storeModule = storeModule;

    window.webContents.once('did-finish-load', () => {
        window.show();

        if (!storeModule.isProd) {
            window.webContents.openDevTools();
        }
    });
}
