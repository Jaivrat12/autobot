import { createRoot } from 'react-dom/client';
import ContentUI from '../components/ContentUI';

import type { FC } from 'react';
import type {
	PlasmoCSUIJSXContainer,
	PlasmoCSUIProps,
	PlasmoRender,
} from 'plasmo';

import mantineStyleText from 'data-text:@mantine/core/styles.css';
import resetStyle from 'data-text:./reset.css';
import indexStyle from 'data-text:./index.css';

export const config = {
    // matches: ['https://www.google.com/*'],
    // all_frames: true
};

export const getRootContainer = () => {

	const getIframe = () => {

		const iframeContainer = document.createElement('autobot-ext');
		document.querySelector('html').prepend(iframeContainer);

		const iframe = document.createElement('iframe');
		iframeContainer.appendChild(iframe);
		const styles = {
			'position': 'fixed',
			'top': '0.5rem',
			'right': '0.5rem',
			'z-index': 2147483647,
			'border': '1px solid #3334',
			'border-radius': '4px',
			'box-shadow': '0 0 1rem #0009',
		};
		const iframeStyles = Object.keys(styles).map(key => `${key}: ${styles[key]}`).join('; ');
		iframe.setAttribute('style', iframeStyles);

		const rootContainer = document.createElement('div');
		rootContainer.id = 'root';
		iframe.contentDocument.querySelector('body').appendChild(rootContainer);

		return rootContainer;
	};

	const getShadow = () => {

		const shadowContainer = document.createElement('autobot-ext');
		document.querySelector('html').prepend(shadowContainer);
		const shadow = shadowContainer.attachShadow({ mode: 'open' });

		const html = document.createElement('html');
		shadow.appendChild(html);

		const body = document.createElement('body');
		const styles = {
			'position': 'fixed',
			'top': '0.5rem',
			'right': '0.5rem',
			'z-index': 2147483647,
			'border-radius': '4px',
			'box-shadow': '0 0 1rem #0009',
		};
		const bodyStyles = Object.keys(styles).map(key => `${key}: ${styles[key]}`).join('; ');
		body.setAttribute('style', bodyStyles);
		html.appendChild(body);

		const rootContainer = document.createElement('div');
		rootContainer.id = 'root';
		body.appendChild(rootContainer);

		return rootContainer;
	};

	return getShadow();
};

const Overlay: FC<PlasmoCSUIProps> = () => {
	return (
		<>
			{/* <style>
				{resetStyle + mantineStyleText + indexStyle}
			</style> */}
			<ContentUI />
		</>
	);
};

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({
	createRootContainer,
}) => {
	const rootContainer = await createRootContainer();
	const root = createRoot(rootContainer);
	root.render(<Overlay />);
};

export default Overlay;