import {
    Button,
    Card,
    Drawer,
    Flex,
    Text,
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import AddNewStorage from './AddNewStorage';

const StorageList = ({ title, storages, onClick }) => {

    return (
        <div>
            <Text size="lg" mb="xs">
                {title}
            </Text>

            <Flex gap="md">
                {storages.map((storage) => (
                    <Card
                        key={storage.id}
                        padding="xs"
                        radius="md"
                        shadow="sm"
                        withBorder
                        style={{ cursor: 'pointer' }}
                        styles={{ root: { cursor: 'pointer' } }}
                        onClick={() => onClick(storage)}
                    >
                        <Text>
                            {storage.name}
                        </Text>
                    </Card>
                ))}
            </Flex>
        </div>
    );
};

const SelectStorage = ({ bot, setBot, storage, setStorage, storageTypes = [] }) => {

    const [bots, setBots] = useLocalStorage({
        key: 'bots',
        defaultValue: {},
    });

    const addStorage = (storage) => {

        const type = storage.type + 's';
        bot.storages[type].push({
            ...storage,
            id: new Date().valueOf(),
        });
        if (bot.id) {
            const updatedBots = { ...bots };
            updatedBots[bot?.id] = bot;
            setBots(updatedBots);
            chrome.storage.local.set({ bots: updatedBots });
        } else {
            const updatedBot = { ...bot };
            setBot(updatedBot);
        }
    };

    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const onStorageClick = (storage) => {
        setStorage(storage);
        closeDrawer();
    };

    return bot?.storages && (

        <>
            <Flex
                align="center"
                gap="sm"
            >
                <Button
                    variant="light"
                    onClick={openDrawer}
                >
                    Select Storage
                </Button>

                <Text>
                    {storage
                        ? `${storage.name} (${storage.type})`
                        : 'Not Selected'
                    }
                </Text>
            </Flex>

            <Drawer
                title="Select Storage"
                position="bottom"
                opened={drawerOpened}
                onClose={closeDrawer}
            >
                <AddNewStorage addStorage={addStorage} />

                <Flex direction="column" gap="lg" mt="lg">
                    {storageTypes.includes('variables') && (
                        <StorageList
                            title="Variables (Single Value)"
                            storages={bot.storages.variables}
                            onClick={onStorageClick}
                        />
                    )}

                    {storageTypes.includes('arrays') && (
                        <StorageList
                            title="Arrays (Multiple Values)"
                            storages={bot.storages.arrays}
                            onClick={onStorageClick}
                        />
                    )}

                    {storageTypes.includes('tables') && (
                        <StorageList
                            title="Tables (Rows & Columns)"
                            storages={bot.storages.tables}
                            onClick={onStorageClick}
                        />
                    )}
                </Flex>
            </Drawer>
        </>
    );
}

export default SelectStorage;