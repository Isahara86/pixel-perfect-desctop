declare namespace PixelPerfectDesktop {
    import BrowserWindow = Electron.BrowserWindow;
    import Rectangle = Electron.Rectangle;

    interface AppGlobal {
        setWindowPosition: SetWindowPosition;
        minimize: MinimizeFunc;
        close: CloseFunc;
        window: BrowserWindow;
        storeModule: StoreModuleLike;
    }

    interface SetWindowPosition {
        (x: number, y: number): void;
    }

    interface MinimizeFunc {
        (): void;
    }

    interface CloseFunc {
        (uiState: UIState): void;
    }

    interface ISettings {
        readonly uiState: UIState;
        readonly windowBounds: Rectangle;
    }

    interface StoreModuleLike {
        getSettings: () => ISettings;
        setSettings: (settings: ISettings, cb: () => void) => void;
    }

    interface ScrollData {
        top: number;
        left: number;
    }

    interface UIState {
        scrollData: ScrollData;
        imgPath: string;
        opacity: number;
    }

}

