declare namespace PixelPerfectDesktop {
    import BrowserWindow = Electron.BrowserWindow;

    interface AppGlobal {
        setWindowPosition: SetWindowPosition;
        minimize: MinimizeFunc;
        close: CloseFunc;
        window: BrowserWindow;
    }

    interface SetWindowPosition {
        (x: number, y: number): void;
    }

    interface MinimizeFunc {
        (): void;
    }

    interface CloseFunc {
        (): void;
    }

}

