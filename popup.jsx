import { useState } from 'react';
import { ThemeProvider } from '~theme';
import Home from './components/Home';

function IndexPopup() {
	return (
		<ThemeProvider>
			<Home />
		</ThemeProvider>
	);
}

export default IndexPopup;
