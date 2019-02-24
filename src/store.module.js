"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class StoreModule {
    constructor() {
        this.isProd = __dirname.includes('resources');
        if (this.isProd) {
            this._dataFilePath = path.join(__dirname, '../../data.json');
        }
        else {
            this._dataFilePath = path.join(__dirname, './data.json');
        }
        this._settings = this._loadSettings();
    }
    _loadSettings() {
        try {
            return fse.readJsonSync(this._dataFilePath);
        }
        catch (e) {
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
            };
        }
    }
    getSettings() {
        return this._settings;
    }
    setSettings(settings, cb) {
        this._settings = settings;
        fse.outputJson(this._dataFilePath, this._settings, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                cb();
            }
        });
    }
}
exports.default = new StoreModule();
//# sourceMappingURL=store.module.js.map