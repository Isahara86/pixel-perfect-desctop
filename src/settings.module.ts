import ISettings = PixelPerfectDesktop.ISettings;
import * as fse from 'fs-extra';
import * as path from "path";
import SettingsModuleLike = PixelPerfectDesktop.SettingsModuleLike;

class SettingsModule implements SettingsModuleLike {

    private readonly _settings: ISettings;
    private readonly _dataFilePath = path.join(__dirname, './data.json');
    private _subscribers: any[] = [];

    constructor() {
        this._settings = this._loadSettings();
    }

    private _loadSettings(): ISettings {
        try {
            return fse.readJsonSync(this._dataFilePath)

        } catch (e) {
            return {
                opacity: 0.7,
                imageFilePath: 'no-file.jpeg',
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
}

export default new SettingsModule();
