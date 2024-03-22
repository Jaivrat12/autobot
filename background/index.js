import { MsgReasons } from '~enums';
import { openBotWindow } from '~utils/helper';

chrome.windows.onFocusChanged.addListener(async (windowId) => {

    if (windowId === -1) return;

    const window = await chrome.windows.get(windowId);
    if (window.type !== 'popup') {
        chrome.storage.sync.set({ lastFocusedWindowId: windowId });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.reason === MsgReasons.OpenPopupAndRunBot) {
        openBotWindow(message.botId, true);
    }
});