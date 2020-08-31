declare namespace PixelPerfectDesktop {
    import Rectangle = Electron.Rectangle;

    interface AppGlobal extends NodeJS.Global {
        managerGlobal: ManagerGlobal;
    }

    interface ManagerGlobal {
        setWindowPosition: SetWindowPosition;
        minimize: MinimizeFunc;
        close: CloseFunc;
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
        imgWidth?: number;
        imgHeight?: number;
    }

}

