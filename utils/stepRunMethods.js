import { ContentUIs, MsgReasons, SelectorTypes } from '~enums';
import {
    extractData,
    getElementByXpath,
    wait,
} from '~utils/helper';

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
        const { selector, selectorType } = step.settings;
        const element = selectorType === SelectorTypes.XPath
            ? getElementByXpath(selector)
            : document.querySelector(selector);
        console.log(element);
        element?.click();
        return { success: true };
    },
    enterText: ({ step }) => {
        const { selector, selectorType } = step.settings;
        const input = selectorType === SelectorTypes.XPath
            ? getElementByXpath(selector)
            : document.querySelector(selector);
        console.log(input);
        input.value = step.settings.text;
        return { success: true };
    },
    removeElement: ({ step }) => {
        const { selector, selectorType } = step.settings;
        const element = selectorType === SelectorTypes.XPath
            ? getElementByXpath(selector)
            : document.querySelector(selector);
        console.log(element);
        element?.remove();
        return { success: true };
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