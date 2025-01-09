const HOST_NAME = "com.github.tacticallaptopbag.resistance";

export class NativeConnection {
    private port?: chrome.runtime.Port;

    constructor() {
        this.connect();
    }

    connect() {
        try {
            console.log('Connecting to ', HOST_NAME);
            this.port = chrome.runtime.connectNative(HOST_NAME);

            this.port.onMessage.addListener((msg) => {
                console.log('RX: ', msg);
            });

            this.port.onDisconnect.addListener(() => {
                console.log('Disconnected from native app: ', chrome.runtime.lastError);
                this.port = undefined;
                setTimeout(() => this.connect(), 60_000);
            });
        } catch (e) {
            console.error('Failed to connect to native app: ', e);
        }

        chrome.extension.isAllowedIncognitoAccess().then((value) => this.sendMessage({
            type: 'init',
            incognito: value
        })).catch(() => this.sendMessage({
            type: 'init',
            incognito: false
        }));
    }

    sendMessage(message: any) {
        if (!this.port) {
            console.error('Cannot send message: Not connected.');
            return;
        }

        try {
            this.port.postMessage(message);
            console.log('TX: ', message);
        } catch (e) {
            console.error('Failed to send message: ', e);
        }
    }

    disconnect() {
        if (this.port) {
            this.port.disconnect();
            this.port = undefined;
        }
    }
}

