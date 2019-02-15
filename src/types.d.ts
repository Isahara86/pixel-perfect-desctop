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
        (): void;
    }

    interface ISettings {
        readonly opacity: number;
        readonly imageFilePath: string;
        readonly windowBounds: Rectangle;
        readonly scrollData: ScrollData;
    }

    interface StoreModuleLike {
        subscribe: (cb: (settings: ISettings) => void) => () => void;
        setOpacity: (opacity: number) => void;
        setImagePath: (newPath: string) => void;
        getSettings: () => ISettings;
    }

    interface ScrollData {
        top: number;
        left: number;
    }

}

