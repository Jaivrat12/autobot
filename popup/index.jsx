import { useEffect, useState } from 'react';
import {
	MemoryRouter,
	Routes,
	Route,
	useNavigate,
} from 'react-router-dom';
import { ThemeProvider } from '../theme';
import Home from '../components/Home';
import BotForm from '../components/BotForm';

const CustomRouter = ({ comp }) => {

	const navigation = useNavigate();
	const [isRunningBot, setIsRunningBot] = useState(false);
	useEffect(() => {
		const url = new URL(window.location.href);
		setIsRunningBot(url.searchParams.has('runBot'));
		if (url.searchParams.has('route')) {
			const route = url.searchParams.get('route');
			url.searchParams.delete('route');
			url.searchParams.delete('runBot');
			history.replaceState(null, null, url);
			navigation(route);
		}
	}, []);

	return comp({ isRunningBot, setIsRunningBot });
};

function IndexPopup() {

	return (

		<ThemeProvider defaultColorScheme="dark">
			<MemoryRouter>
				<Routes>
					<Route
						path="/"
						element={
							<CustomRouter
								comp={({ setIsRunningBot }) => (
									<Home setIsRunningBot={setIsRunningBot} />
								)}
							/>
						}
					/>

					<Route
						path="/bots/:id"
						element={
							<CustomRouter
								comp={({ isRunningBot, setIsRunningBot }) => (
									<BotForm
										isRunningBot={isRunningBot}
										setIsRunningBot={setIsRunningBot}
									/>
								)}
							/>
						}
					/>
				</Routes>
			</MemoryRouter>
		</ThemeProvider>
	);
}

export default IndexPopup;