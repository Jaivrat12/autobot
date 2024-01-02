import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@mantine/hooks';
import {
    ActionIcon,
    Button,
    Card,
    Container,
    Divider,
    Flex,
    Text,
    Title
} from '@mantine/core';
import {
    IconPlayerPlay,
    IconPlus,
    IconTrash,
} from '@tabler/icons-react';
import ShortcutKey from './Common/ShortcutKey';

const Home = ({ setIsRunningBot }) => {

    const navigation = useNavigate();

    const [bots, setBots] = useLocalStorage({
        key: 'bots',
        defaultValue: {},
    });

    const deleteBot = (bot) => {
        const updatedBots = { ...bots };
        delete updatedBots[bot.id];
        setBots(updatedBots);
        chrome.storage.local.set({ bots: updatedBots });
    };

    const goToBotForm = async (botId, runBot = false) => {

        const route = `/bots/${botId ?? 'create'}`;

        const { type: windowType } = await chrome.windows.getCurrent();
        if (windowType === 'popup') {
            navigation(route);
            setIsRunningBot(runBot);
            return;
        }

        await chrome.windows.create({
            // focused: false,
            // width: 400,
            // height: 600,
            type: 'popup',
            url: `popup.html?route=${route}${runBot ? '&runBot' : ''}`,
            top: 0,
            left: 0,
        });
        window.close();
    };

    return (

        <Container
            p="lg"
            style={{
                width: '24rem',
                height: '36rem',
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                mb="lg"
            >
                <Title order={2} fw="normal">
                    Autobot
                </Title>

                <Button
                    leftSection={<IconPlus />}
                    onClick={() => goToBotForm()}
                >
                    New Bot
                </Button>
            </Flex>

            <Divider my="lg" />

            {Object.values(bots).map((bot) => (

                <Card
                    key={bot.id}
                    shadow="sm"
                    padding="xs"
                    radius="md"
                    withBorder
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                    }}
                >
                    <Flex justify="space-between">
                        <Text
                            onClick={() => goToBotForm(bot.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {bot.name}
                        </Text>

                        <Flex>
                            <ActionIcon
                                color="green"
                                variant="subtle"
                                onClick={() => goToBotForm(bot.id, true)}
                            >
                                <IconPlayerPlay size="1.125rem" />
                            </ActionIcon>

                            <ActionIcon
                                color="red"
                                variant="subtle"
                                onClick={() => deleteBot(bot)}
                            >
                                <IconTrash size="1.125rem" />
                            </ActionIcon>
                        </Flex>
                    </Flex>

                    <ShortcutKey shortcutKey={bot.settings.shortcutKey} />
                </Card>
            ))}
        </Container>
    );
}

export default Home;