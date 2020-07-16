"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fse = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class StoreModule {
    constructor() {
        this.isProd = __dirname.toLocaleLowerCase().includes('resources');
        this._dataFilePath = this._getDataPath();
        this._settings = this._loadSettings();
    }
    _getDataPath() {
        if (process.platform === 'darwin') {
            return path.join(electron_1.app.getPath('userData'), './data.json');
        }
        if (this.isProd) {
            return path.join(__dirname, '../../data.json');
        }
        else {
            return path.join(__dirname, './data.json');
        }
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