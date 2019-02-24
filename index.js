"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const manager_1 = require("./src/manager");
electron_1.app.on('ready', manager_1.init);
//# sourceMappingURL=index.js.map