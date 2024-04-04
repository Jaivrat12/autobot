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
} from '@tabler/icons-react';
import DeleteButton from './Common/DeleteButton';
import ShortcutKey from './Common/ShortcutKey';
import { openBotWindow } from '~utils/helper';

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

        const { success, route } = await openBotWindow(botId, runBot);
        // if not success then it means that window is already opened
        if (!success) {
            navigation(route);
            setIsRunningBot(runBot);
        }
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

                            <DeleteButton
                                content={`Are you sure you want to delete this bot (${bot.name})?`}
                                onConfirm={() => deleteBot(bot)}
                            />
                        </Flex>
                    </Flex>

                    <ShortcutKey shortcutKey={bot.settings.shortcutKey} />
                </Card>
            ))}
        </Container>
    );
}

export default Home;