declare namespace PixelPerfectDesktop {
    import BrowserWindow = Electron.BrowserWindow;

    interface AppGlobal {
        setWindowPosition: SetWindowPosition;
        window: BrowserWindow;
    }

    interface SetWindowPosition {
        (x: number, y: number): void;
    }
}

