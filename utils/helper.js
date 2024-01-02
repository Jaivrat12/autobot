import { MsgReasons, SelectorTypes } from '~enums';

export function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function getElementFullName(element) {

    const { localName, id, classList } = element;
    let elementName = localName;
    if (id) elementName += '#' + id;
    if (classList.length) {
        const classNames = classList.toString().replaceAll(' ', '.');
        elementName += '.' + classNames;
    }
    return elementName;
}

export function getElementByXpath(path) {

    return document.evaluate(
        path,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

export async function getActiveTab(focused) {

    try {

        const { lastFocusedWindowId } = await chrome.storage.sync.get();
        if (lastFocusedWindowId) {
            const [tab] = await chrome.tabs.query({
                active: true,
                windowId: lastFocusedWindowId,
            });
            await chrome.windows.update(lastFocusedWindowId, { focused });
            return tab;
        }

        let windowId = null;
        const tabsQuery = {
            active: true,
            url: '*://*/*',
        };

        const extURL = chrome.runtime.getURL('');
        const windows = await chrome.windows.getAll({ populate: true });
        for (const browserWindow of windows) {

            const [tab] = browserWindow.tabs;
            const isDashboard = browserWindow.tabs.length === 1
                && tab.url?.includes(extURL);

            if (isDashboard) {
                await chrome.windows.update(browserWindow.id, {
                    focused: false,
                });
            } else if (browserWindow.focused) {
                windowId = browserWindow.id;
            }
        }

        if (windowId) {
            tabsQuery.windowId = windowId;
        } else if (windows.length > 2) {
            tabsQuery.lastFocusedWindow = true;
        }

        const [tab] = await chrome.tabs.query(tabsQuery);
        return tab;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function focusCurrentWindow() {
    const { id } = await chrome.windows.getCurrent();
    await chrome.windows.update(id, { focused: true });
}

export async function extractData(step, tabId) {

    const { storageType } = step.settings;

    let selector, selectorType, multiple, dataType;
    multiple = storageType !== 'variable';
    selectorType = SelectorTypes.CSS;

    const sendMessage = () => chrome.tabs.sendMessage(tabId, {
        reason: MsgReasons.ExtractData,
        selector,
        selectorType,
        multiple,
        dataType,
    });

    if (storageType !== 'table') {
        selector = step.settings.data.selector;
        dataType = step.settings.data.type;
        return await sendMessage();
    } else {

        const columns = [];
        for (const column of step.settings.data) {
            selector = column.selector;
            dataType = column.type;
            columns.push(await sendMessage());
        }

        const rows = [];
        for (let i = 0; i < columns[0].length; i++) {
            const row = [];
            for (let j = 0; j < columns.length; j++) {
                row.push(columns[j][i]);
            }
            rows.push(row);
        }
        return rows;
    }
}

export function getKeysCombo(e, preventDefault = false) {

    if (preventDefault) {
        e.preventDefault();
        e.stopPropagation();
    }

    const keysMap = {
        altKey: 'Alt',
        ctrlKey: 'Ctrl',
        metaKey: '⌘',
        shiftKey: 'Shift',
    };

    const keys = [];
    Object.entries(keysMap).forEach(([key, value]) => {
        if (e[key]) keys.push(value);
    });
    if (!['Alt', 'Control', 'Meta', 'Shift'].includes(e.key)) {
        keys.push(e.key.toUpperCase());
    }
    return keys.join('+');
}