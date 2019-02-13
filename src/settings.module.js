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
class SettingsModule {
    constructor() {
        this._dataFilePath = path.join(__dirname, './data.json');
        this._subscribers = [];
        if (__dirname.includes('resources')) {
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
            return {
                opacity: 0.7,
                imageFilePath: 'no-file.jpeg',
            };
        }
    }
    subscribe(cb) {
        this._subscribers.push(cb);
        return () => {
            this._subscribers = this._subscribers.filter(sub => sub !== cb);
        };
    }
    setImagePath(newPath) {
        // @ts-ignore
        this._settings.imageFilePath = newPath;
        this.saveAndNotify();
    }
    setOpacity(opacity) {
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
    getSettings() {
        return this._settings;
    }
}
exports.default = new SettingsModule();
