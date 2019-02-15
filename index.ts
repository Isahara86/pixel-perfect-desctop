import {app, BrowserWindow} from 'electron';
import {init} from "./src/manager";

app.on('ready', start);

function start() {
    const window = new BrowserWindow({
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        minHeight: 250,
        minWidth: 250,
        show: false,
    });

    window.loadURL(`file://${__dirname}/UI/index.html`);

    window.on("closed", () => {
        process.exit();
    });

    init(window);
}


