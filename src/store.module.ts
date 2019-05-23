import ISettings = PixelPerfectDesktop.ISettings;
import {app} from 'electron';
import * as fse from 'fs-extra';
import * as path from "path";
import SettingsModuleLike = PixelPerfectDesktop.StoreModuleLike;

class StoreModule implements SettingsModuleLike {

    private _settings: ISettings;
    private readonly _dataFilePath: string;
    public readonly isProd: boolean;

    constructor() {
        this.isProd = __dirname.toLocaleLowerCase().includes('resources');
        this._dataFilePath = this._getDataPath();
        this._settings = this._loadSettings();
    }

    private _getDataPath() {
        if (process.platform === 'darwin') {
            return path.join(app.getPath('userData'), './data.json');
        }

        if (this.isProd) {
            return path.join(__dirname, '../../data.json');
        } else {
            return path.join(__dirname, './data.json');
        }
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
