declare namespace PixelPerfectDesktop {
    import BrowserWindow = Electron.BrowserWindow;

    interface AppGlobal {
        setWindowPosition: SetWindowPosition;
        minimize: MinimizeFunc;
        close: CloseFunc;
        window: BrowserWindow;
        settingsModule: SettingsModuleLike;
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
    }

    interface SettingsModuleLike {
        subscribe: (cb: (settings: ISettings) => void) => () => void;
        setOpacity: (opacity: number) => void;
        setImagePath: (newPath: string) => void;
        getSettings: () => ISettings;
    }

}

