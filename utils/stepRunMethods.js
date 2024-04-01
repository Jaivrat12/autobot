import { ContentUIs, MsgReasons } from '~enums';
import {
    enterText,
    extractData,
    getElementBySelector,
    wait,
} from '~utils/helper';

const getElement = async ({
    selector,
    selectorType,
    retryCount,
    retryDelay,
    retryInfinitely,
}, callback) => {

    const retries = retryInfinitely ? Infinity : retryCount;
    const element = await getElementBySelector(selector, selectorType, retries, retryDelay);
    if (element) {
        return { success: callback(element) };
    }

    console.log(`Couldn't find element (${selector})`);
    return { success: false };
};

const stepRunMethods = {
    goToPage: async ({ step, tabId, updateCurrentTab }) => {

        const tabProps = { url: step.settings.pageURL };
        const tab = step.settings.openInNewTab
            ? await chrome.tabs.create(tabProps)
            : await chrome.tabs.update(tabId, tabProps);
        updateCurrentTab(tab);
        return { success: true };
    },
    clickElement: ({ step }) => {
        return getElement(step.settings, (el) => {
            el.click();
            return true;
        });
    },
    enterText: ({ step }) => {
        // https://stackoverflow.com/questions/40894637/how-to-programmatically-fill-input-elements-built-with-react/70848568
        // https://stackoverflow.com/questions/23892547/what-is-the-best-way-to-trigger-change-or-input-event-in-react-js
        return getElement(step.settings, (input) => {
            return enterText(input, step.settings.text);
        });
    },
    removeElement: ({ step }) => {
        return getElement(step.settings, (el) => {
            el.remove();
            return true;
        });
    },
    getTabInfo: async ({ step, tabId, updateStorage }) => {
        const tab = await chrome.tabs.get(tabId);
        updateStorage(step, [tab[step.settings.tabProp]]);
        return { success: true };
    },
    extractData: async ({ step, tabId, updateStorage }) => {
        const data = await extractData(step, tabId);
        updateStorage(step, data);
        return { success: true };
    },
    wait: async ({ step }) => {
        await wait(step.settings.time);
        return { success: true };
    },
    waitForConfirmation: async ({ tabId }) => {
        return await chrome.tabs.sendMessage(tabId, {
            reason: MsgReasons.ShowUI,
            component: ContentUIs.WaitForConfirmation,
        });
    },
};

export default stepRunMethods;