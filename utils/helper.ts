import { MsgReasons, SelectorTypes } from '~enums';
import type { TextInput } from '~types';

export function wait(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/********************** DOM/Content **********************/
export function getElementFullName(element: Element) {
	const { localName, id, classList } = element;
	let elementName = localName;
	if (id) elementName += '#' + id;
	if (classList.length) {
		const classNames = classList.toString().replaceAll(' ', '.');
		elementName += '.' + classNames;
	}
	return elementName;
}

// ! altering xpath without knowledge can be dangerous
export function getElementByXpath(path: string) {
	let xpath = path;
	if (!path.includes('/body/')) {
		xpath = '//body//' + path.replace(/^\/\//, '');
	}
	return document.evaluate(
		xpath,
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null,
	).singleNodeValue;
}

export async function getElementBySelector(
	selector: string,
	selectorType: SelectorTypes,
	retryCount = 0,
	retryDelay = 1000,
) {
	let element: Node | null = null;
	let i = 0;
	while (i <= retryCount) {
		console.log(`Selecting element (${selector})`);
		element =
			selectorType === SelectorTypes.XPath
				? getElementByXpath(selector)
				: document.body.querySelector(selector);
		if (element) {
			console.log(element);
			console.log(`(retryCount: ${i})`);
			return element;
		}

		// wait & retry (if element not found)
		i++;
		if (i <= retryCount) {
			console.log('retrying...');
			await wait(retryDelay);
		}
	}
	return null;
}

export function enterText(input: TextInput, text: string) {
	// ? this works across multiple input types?
	// ? https://stackoverflow.com/a/47409362

	try {
		let prototype: TextInput;
		if (input instanceof HTMLInputElement) {
			prototype = HTMLInputElement.prototype;
		} else if (input instanceof HTMLTextAreaElement) {
			prototype = HTMLTextAreaElement.prototype;
		} else {
			throw new Error(
				'Invalid input type, only "text" and "textarea" are supported',
			);
		}

		const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
			prototype,
			'value',
		)?.set;
		if (nativeInputValueSetter) {
			nativeInputValueSetter.call(input, text);
			const event = new Event('input', { bubbles: true });
			input.dispatchEvent(event);
			return true;
		} else {
			throw new Error(
				'Could not find native setter for the input element',
			);
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}

export async function extractData(step: any, tabId: number) {
	const { storageType } = step.settings;

	let selector: string,
		selectorType: SelectorTypes,
		multiple: boolean,
		dataType: string;
	multiple = storageType !== 'variable';
	selectorType = SelectorTypes.CSS;

	type sendMessageArgs = {
		reason: MsgReasons;
		selector: string;
		selectorType: SelectorTypes;
		multiple: boolean;
		dataType: string;
	};

	const sendMessage = () =>
		chrome.tabs.sendMessage<sendMessageArgs, string[]>(tabId, {
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
		const columns: string[][] = [];
		for (const column of step.settings.data) {
			selector = column.selector;
			dataType = column.type;
			columns.push(await sendMessage());
		}

		const rows: string[][] = [];
		for (let i = 0; i < columns[0].length; i++) {
			const row: string[] = [];
			for (let j = 0; j < columns.length; j++) {
				row.push(columns[j][i]);
			}
			rows.push(row);
		}
		return rows;
	}
}

export function getKeysCombo(e: KeyboardEvent, preventDefault = false) {
	if (preventDefault) {
		e.preventDefault();
		e.stopPropagation();
	}

	type keyType = 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey';
	const keysMap: Record<keyType, string> = {
		altKey: 'Alt',
		ctrlKey: 'Ctrl',
		metaKey: '⌘',
		shiftKey: 'Shift',
	};

	const keys: string[] = [];
	Object.entries(keysMap).forEach(([key, value]) => {
		if (e[key as keyType]) {
			keys.push(value);
		}
	});
	if (!['Alt', 'Control', 'Meta', 'Shift'].includes(e.key)) {
		keys.push(e.key.toUpperCase());
	}
	return keys.join('+');
}

/******************* Chrome Windows/Tabs *******************/
export async function getActiveTab(focused: boolean) {
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

		let windowId: number | undefined;
		const tabsQuery: chrome.tabs.QueryInfo = {
			active: true,
			url: '*://*/*',
		};

		const extURL = chrome.runtime.getURL('');
		const windows = await chrome.windows.getAll({ populate: true });
		for (const browserWindow of windows) {
			const tab = browserWindow.tabs?.[0];
			const isDashboard =
				browserWindow.tabs?.length === 1 && tab?.url?.includes(extURL);

			if (isDashboard) {
				if (browserWindow.id) {
					await chrome.windows.update(browserWindow.id, {
						focused: false,
					});
				}
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

export async function openBotWindow(botId: string, runBot = false) {
	const route = `/bots/${botId ?? 'create'}`;
	let success = false;

	const currWindow = await chrome.windows.getCurrent();
	// const tabs = await chrome.tabs.query({
	//     url: chrome.runtime.getURL('popup.html')
	// });
	// tabs.map(({ windowId }) => {
	//     if (windowId !== currWindow.id) {
	//         chrome.windows.remove(windowId);
	//     }
	// });

	if (currWindow.type !== 'popup') {
		await chrome.windows.create({
			state: runBot ? 'minimized' : 'maximized',
			type: 'popup',
			url: `popup.html?route=${route}${runBot ? '&runBot' : ''}`,
		});

		// if (window) {
		//     window.close();
		// }
		success = true;
	}

	return { success, route };
}

export async function focusCurrentWindow() {
	const { id } = await chrome.windows.getCurrent();
	if (id) {
		await chrome.windows.update(id, { focused: true });
	}
}
