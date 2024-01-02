import { useEffect, useState } from 'react';
import ElementSelector from './ElementSelector';
import WaitForConfirmation from './WaitForConfirmation';
import { ContentUIs, MsgReasons } from '~enums';
import { getKeysCombo } from '~utils/helper';

const eventTypeToComponent = {
	[ContentUIs.ElementSelector]: ElementSelector,
	[ContentUIs.WaitForConfirmation]: WaitForConfirmation,
};

// ! Not working as expected here (rem affected due to main html's font-size)
// 		! https://www.realme.com/in/
// 		! https://realme.clickpost.in/
function ContentUI() {

	const [bots, setBots] = useState(null);
	const [event, setEvent] = useState(null);
	const closeEvent = () => setEvent(null);

	useEffect(() => {

		chrome.storage.local.get({ bots: {} }, ({ bots }) => setBots(bots));
		const onStorageChange = (changes) => {
			if (changes.bots) {
				setBots(changes.bots.newValue);
			}
		};
		chrome.storage.local.onChanged.addListener(onStorageChange);

		const onMessage = (message, sender, sendResponse) => {
			if (message.reason === MsgReasons.ShowUI) {
				setEvent({
					...message,
					component: eventTypeToComponent[message?.component],
					sendResponse: (...args) => {
						sendResponse(...args);
						closeEvent();
					},
				});
				return true;
			}
		};
		chrome.runtime.onMessage.addListener(onMessage);

		return () => {
			chrome.storage.local.onChanged.removeListener(onStorageChange);
			chrome.runtime.onMessage.removeListener(onMessage);
		};
	}, []);

	useEffect(() => {

		if (!bots) {
			return;
		}

		const listenToShortcutKey = (e) => {
			const shortcutKey = getKeysCombo(e);
			const bot = Object.values(bots).find((bot) => bot.settings.shortcutKey === shortcutKey);
			if (bot) {
				chrome.runtime.sendMessage({
					reason: MsgReasons.OpenPopupAndRunBot,
					botId: bot.id,
				});
			}
		};
		document.addEventListener('keydown', listenToShortcutKey);
		return () => document.removeEventListener('keydown', listenToShortcutKey);
	}, [bots]);

	// useEffect(() => {

	// 	if (!bots) {
	// 		return;
	// 	}

	// 	const bot = Object.values(bots).find((bot) => {

	// 		const { runOnStartUrlList, runOnStartUrlMatchHostNameOnly } = bot.settings;
	// 		if (runOnStartUrlList.length === 0) {
	// 			return false;
	// 		}

	// 		const urlPart = runOnStartUrlMatchHostNameOnly ? 'hostname' : 'href';
	// 		const urls = runOnStartUrlList
	// 			.filter((url) => URL.canParse(url))
	// 			.map((url) => new URL(url)[urlPart]);
	// 		return urls.includes(location[urlPart]);
	// 	});

	// 	if (bot) {
	// 		chrome.runtime.sendMessage({
	// 			reason: MsgReasons.OpenPopupAndRunBot,
	// 			botId: bot.id,
	// 		});
	// 	}
	// }, [bots]);

	return event && (
		<event.component { ...event } />
	);
}

export default ContentUI;