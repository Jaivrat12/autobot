import { MsgReasons } from '~enums';

chrome.windows.onFocusChanged.addListener(async (windowId) => {

    if (windowId === -1) return;

    const window = await chrome.windows.get(windowId);
    if (window.type !== 'popup') {
        chrome.storage.sync.set({ lastFocusedWindowId: windowId });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.reason === MsgReasons.OpenPopupAndRunBot) {
        chrome.windows.create({
            // focused: false,
            // width: 400,
            // height: 600,
            type: 'popup',
            url: `popup.html?route=/bots/${message.botId}&runBot`,
            top: 0,
            left: 0,
        });
    }
});