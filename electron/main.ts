import { Logger } from './core/logger/logger-electron';
import { Application } from './application';
import { Settings } from './settings/settings';
import { app, BrowserWindow, dialog, session } from 'electron';

const settings = require('electron-settings');

// Ignore black list GPU for WebGL
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

// Disable backgrounding renderer
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");

// Bypass SSL bad certificate
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

(process as NodeJS.EventEmitter).on('uncaughtException', function (error) {

    Logger.error(error);

    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
        type: 'error',
        title: 'Error',
        message: 'An error occured in yout settings, they will be reseted :' + error.toString(),
        buttons: ['Close']
    }, () => {

        Settings.resetSettings();
        app.exit();
    });

});

app.on('ready', () => {
    Settings.init();
    Application.run();
});
