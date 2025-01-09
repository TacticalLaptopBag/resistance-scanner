import { NativeConnection } from "./native-connection";

const nativeConn = new NativeConnection();

chrome.webNavigation.onCompleted.addListener((details) => {
    if (details.frameId === 0) {
        nativeConn.sendMessage({
            type: 'navigation',
            url: details.url
        });
    }
});

