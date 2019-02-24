import {app} from 'electron';
import {init} from "./src/manager";

app.on('ready', init);
