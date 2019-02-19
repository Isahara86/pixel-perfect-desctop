import ISettings = PixelPerfectDesktop.ISettings;
import * as fse from 'fs-extra';
import * as path from "path";
import SettingsModuleLike = PixelPerfectDesktop.StoreModuleLike;
import Rectangle = Electron.Rectangle;

class StoreModule implements SettingsModuleLike {

    private _settings: ISettings;
    private readonly _dataFilePath: string;
    public readonly isProd: boolean;

    private _subscribers: any[] = [];

    constructor() {
        this.isProd = __dirname.includes('resources');

        if (this.isProd) {
            this._dataFilePath = path.join(__dirname, '../../data.json');
        } else {
            this._dataFilePath = path.join(__dirname, './data.json');
        }


        this._settings = this._loadSettings();
    }

    private _loadSettings(): ISettings {
        try {
            return fse.readJsonSync(this._dataFilePath)

        } catch (e) {
            return {
                opacity: 0.7,
                imageFilePath: 'no-file.jpeg',
                // @ts-ignore
                windowBounds: null,
                // @ts-ignore
                scrollData: null,
            }
        }
    }

    public subscribe(cb: (settings: ISettings) => void): () => void {
        this._subscribers.push(cb);

        return () => {
            this._subscribers = this._subscribers.filter(sub => sub !== cb)
        }

    }

    public setImagePath(newPath: string): void {
        // @ts-ignore
        this._settings.imageFilePath = newPath;
        this.saveAndNotify();
    }

    public setOpacity(opacity: number): void {
        // @ts-ignore
        this._settings.opacity = opacity;
        this.saveAndNotify();
    }

    saveAndNotify() {
        this._subscribers.forEach(cb => cb());
        fse.outputJson(this._dataFilePath, this._settings, (err) => {
            if (err) {
                console.log(err);
            }
        });

    }

    getSettings(): ISettings {
        return this._settings;
    }

    saveWindowState(data: { windowBounds: Rectangle, scrollData: ScrollData }): void {
        this._settings = {...this._settings, ...data};
        this.saveAndNotify();
    }
}

export default new StoreModule();
