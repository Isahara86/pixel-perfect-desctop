import AppGlobal = PixelPerfectDesktop.AppGlobal;
import storeModule from './store.module';
import {BrowserWindow} from 'electron';

const globalObj: AppGlobal = <any>global;
let browserWindow: BrowserWindow;

function setWindowPosition(x: number, y: number) {
    const curPos = browserWindow.getPosition();
    browserWindow.setPosition(curPos[0] + x, curPos[1] + y);
}

function minimize() {
    browserWindow.minimize();
}

function close(uiState: UIState) {
    saveState(uiState, () => browserWindow.close());
}

function saveState(uiState: UIState, cb: any) {
    const windowBounds = browserWindow.getBounds();
    storeModule.setSettings({windowBounds, uiState}, cb);
}

function createWindow(): BrowserWindow {
    const windowBounds = storeModule.getSettings().windowBounds;

    const window = new BrowserWindow({
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

    return window
}

export function init() {
    browserWindow = createWindow();

    globalObj.managerGlobal = {
        setWindowPosition,
        minimize,
        close,
        storeModule,
    };


    browserWindow.webContents.once('did-finish-load', () => {
        browserWindow.show();

        if (!storeModule.isProd) {
            browserWindow.webContents.openDevTools();
        }
    });
}
