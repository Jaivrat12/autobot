import { MantineProvider } from '@mantine/core';
import type { PropsWithChildren } from 'react';
import type { MantineProviderProps } from '@mantine/core';

import '@mantine/core/styles.css';

export function ThemeProvider({ children, ...props }: PropsWithChildren<MantineProviderProps>) {
	return (
		<MantineProvider {...props}>
			{children}
		</MantineProvider>
	);
}