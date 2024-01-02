import { MsgReasons, SelectorDataTypes, SelectorTypes } from '~enums/';
import stepRunMethods from '~utils/stepRunMethods';

export const config = {
    // matches: [
    //     'https://www.google.com/*',
    // ],
    // all_frames: true
};

window.addEventListener('load', async () => {

    const { bots } = await chrome.storage.local.get();

    Object.values(bots).forEach((bot) => {

        const { runOnStartUrlList, runOnStartUrlMatchHostNameOnly } = bot.settings;
        if (runOnStartUrlList.length === 0) {
            return;
        }

        const urlPart = runOnStartUrlMatchHostNameOnly ? 'hostname' : 'href';
        const urls = runOnStartUrlList
            .filter((url) => URL.canParse(url))
            .map((url) => new URL(url)[urlPart]);

        if (urls.includes(location[urlPart])) {
            chrome.runtime.sendMessage({
                reason: MsgReasons.OpenPopupAndRunBot,
                botId: bot.id,
            });
        }
    });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    if (msg.reason === MsgReasons.RunStep) {
        const step = msg.step;
        const runMethod = stepRunMethods[step.id];
        (async () => sendResponse(await runMethod({ step })))();
        return true;
    } else if (msg.reason === MsgReasons.ExtractData) {

        const {
            selector,
            selectorType,
            multiple,
            dataType,
        } = msg;

        let data, elements;
        if (selectorType === SelectorTypes.CSS) {
            elements = multiple
                ? [...document.querySelectorAll(selector)]
                : [document.querySelector(selector)];
        }

        data = elements.map((element) => {
            if (dataType === SelectorDataTypes.Text) {
                return element.innerText;
            } else if (dataType === SelectorDataTypes.Link) {
                return element.href || element.querySelector('a')?.href;
            } else if (dataType === SelectorDataTypes.Image) {
                return element.src || element.querySelector('img')?.src;
            }
        });
        sendResponse(data);
    }
});