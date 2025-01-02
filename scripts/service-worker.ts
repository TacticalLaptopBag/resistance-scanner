import { NativeConnection } from "./native-connection";

const nativeConn = new NativeConnection();

browser.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId === 0) {
        nativeConn.sendMessage({
            type: 'navigation',
            url: details.url
        });
    }
});

browser.extension.isAllowedIncognitoAccess().then((value) => nativeConn.sendMessage({
    type: 'init',
    incognito: value
})).catch(() => nativeConn.sendMessage({
    type: 'init',
    incognito: false
}));

