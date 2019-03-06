import ISettings = PixelPerfectDesktop.ISettings;
import * as fse from 'fs-extra';
import * as path from "path";
import SettingsModuleLike = PixelPerfectDesktop.StoreModuleLike;

class StoreModule implements SettingsModuleLike {

    private _settings: ISettings;
    private readonly _dataFilePath: string;
    public readonly isProd: boolean;

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
            console.log(e);
            return {
                windowBounds: {
                    height: 800,
                    width: 600,
                    x: 0,
                    y: 0,
                },
                uiState: {
                    imgPath: 'no-file.jpeg',
                    opacity: 0.7,
                    scrollData: {
                        left: 0,
                        top: 0,
                    },
                },
            }
        }
    }

    getSettings(): ISettings {
        return this._settings;
    }

    setSettings(settings: ISettings, cb: any): void {
        this._settings = settings;

        fse.outputJson(this._dataFilePath, this._settings, (err) => {
            if (err) {
                console.log(err);
            } else {
                cb();
            }
        });
    }
}

export default new StoreModule();
