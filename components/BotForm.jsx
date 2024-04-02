import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useDisclosure,
    useLocalStorage,
} from '@mantine/hooks';
import {
    ActionIcon,
    Button,
    Card,
    Container,
    Divider,
    Drawer,
    Flex,
    Modal,
    Switch,
    Text,
    TextInput,
    Textarea,
} from '@mantine/core';
import {
    IconArrowLeft,
    IconCheck,
    IconDeviceFloppy,
    IconEdit,
    IconPlayerPlayFilled,
    IconPlus,
    IconSettings,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import ResultData from './Common/ResultData';
import ShortcutKey from './Common/ShortcutKey';
import StepForm from './Common/StepForm';
import { MsgReasons } from '~enums';
import { focusCurrentWindow, getActiveTab, getKeysCombo, wait } from '~utils/helper';
import stepTemplates from '~utils/stepTemplates';

const getStepTemplate = (stepId) => {
    const stepTemplate = stepTemplates[stepId];
    return {
        ...JSON.parse(JSON.stringify(stepTemplate)),
        component: stepTemplate.component,
    };
};

const BotForm = ({ isRunningBot, setIsRunningBot }) => {

    const { id } = useParams();
    const navigation = useNavigate();
    const goToHome = () => navigation('/');

    const [previewModalOpened, {
        open: openPreviewModal,
        close: closePreviewModal,
    }] = useDisclosure(false);

    const [settingsModalOpened, {
        open: openSettingsModal,
        close: closeSettingsModal,
    }] = useDisclosure(false);

    const [isDrawerOpen, {
        open: openDrawer,
        close: closeDrawer,
    }] = useDisclosure(false);

    const [bots, setBots] = useLocalStorage({
        key: 'bots',
        defaultValue: {},
    });

    const [bot, setBot] = useState(null);
    const [botSettings, setBotSettings] = useState({});
    const [stepInsertIndex, setStepInsertIndex] = useState(-1);
    const [isListeningToKeys, setIsListeningToKeys] = useState(false);
    const [tempShortcutKey, setTempShortcutKey] = useState('');

    const listenToKeys = (e) => {
        setTempShortcutKey(getKeysCombo(e, true));
    };

    const removeEventListener = () => {
        document.removeEventListener('keydown', listenToKeys);
    };

    const handleSettingsChange = (e) => {

        let { name, value, checked, type } = e.target;
        if (name === 'runOnStartUrlList') {
            value = value.split('\n');
        }
        setBotSettings((settings) => ({
            ...settings,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const saveBot = (bot) => {
        const updatedBots = { ...bots };
        bot.id ??= new Date().valueOf();
        updatedBots[bot.id] = bot;
        setBots(updatedBots);
        chrome.storage.local.set({ bots: updatedBots });
    };

    const saveSettings = () => {

        setBot((bot) => ({
            ...bot,
            settings: botSettings,
        }));

        if (bot.id) {
            const updatedBots = { ...bots };
            updatedBots[bot.id] = {
                ...updatedBots[bot.id],
                settings: botSettings,
            };
            setBots(updatedBots);
            chrome.storage.local.set({ bots: updatedBots });
        }

        closeSettingsModal();
    };

    const discardCloseSettingsModal = () => {
        setBotSettings(bot.settings);
        closeSettingsModal();
    };

    const setStep = (step, i) => {

        step.uid ??= uuidv4();

        const deleteCount = stepInsertIndex === -1 ? 1 : 0;
        const index = stepInsertIndex === -1 ? i : stepInsertIndex;

        const newBot = { ...bot };
        newBot.steps.splice(index, deleteCount, step);
        setBot(newBot);
    };

    const copyStep = (i) => {
        const newBot = { ...bot };
        const step = JSON.parse(JSON.stringify(newBot.steps[i]));
        step.uid = uuidv4();
        newBot.steps.splice(i + 1, 0, step);
        setBot(newBot);
    };

    const deleteStep = (i) => {
        const newBot = { ...bot };
        newBot.steps.splice(i, 1);
        setBot(newBot);
    };

    useEffect(() => {

        if (bot) return;

        if (id === 'create') {
            const settings = {
                openInNewWindow: false,
                shortcutKey: '',
                runOnPageLoad: false,
                runOnStartUrlList: [],
                runOnStartUrlMatchHostNameOnly: false,
                focusBotWindowAfterExec: false,
            };
            setBot({
                name: 'New Bot',
                settings,
                steps: [],
                storages: {
                    variables: [],
                    arrays: [],
                    tables: [],
                },
            });
            setBotSettings(settings);
        } else if (bots[id]) {
            setBot(JSON.parse(JSON.stringify(bots[id])));
            setBotSettings({ ...bots[id].settings });
        }
    }, [bots]);

    useEffect(() => {

        if (!settingsModalOpened) {
            setIsListeningToKeys(false);
        } else if (isListeningToKeys) {
            document.addEventListener('keydown', listenToKeys);
        } else {
            removeEventListener();
        }
        return removeEventListener;
    }, [isListeningToKeys, settingsModalOpened]);

    const [runState, setRunState] = useState({
        tab: null,
        isRunning: false,
        currStep: -1,
        storages: {},
    });

    const runBot = async () => {

        let tab;
        if (bot.settings.openInNewWindow) {
            const window = await chrome.windows.create({
                focused: true,
                state: 'maximized',
                url: bot.settings.windowUrl,
            });
            tab = window.tabs[0];
        } else {
            tab = await getActiveTab(true);
        }

        setRunState({
            tab: tab,
            isRunning: true,
            currStep: 0,
            storages: {},
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, updatedTab) => {
            if (tabId === tab.id) {
                // console.log('tabChange:', changeInfo);
                setRunState((state) => ({
                    ...state,
                    tab: updatedTab,
                }));
            }
        });
    };

    useEffect(() => {

        // console.log('useEffect:', runState.tab?.status, runState.isRunning);
        const { isRunning, tab, currStep } = runState;
        if (!isRunning || tab?.status !== 'complete') {
            return;
        }

        (async () => {

            setRunState((state) => ({
                ...state,
                isRunning: false,
            }));

            const updateCurrentTab = (newTab) => {
                setRunState((runState) => ({ ...runState, tab: newTab }));
                chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    if (tabId === newTab.id) {
                        setRunState((state) => ({ ...state, tab }));
                    }
                });
            };

            const updateStorage = (step, data) => {

                console.log('updateStorage:', step, data);
                const { storageId, storageType } = step.settings;
                const storages = { ...runState.storages };
                const storage = bot.storages[storageType + 's'].find(({ id }) => id === storageId);
                if (storageType === 'variable') {
                    storages[storageId] = {
                        id: storage.id,
                        name: storage.name,
                        type: storage.type,
                        metadata: step.settings.data,
                        data,
                    };
                } else {
                    storages[storageId] ??= {
                        id: storage.id,
                        name: storage.name,
                        type: storage.type,
                        metadata: step.settings.data,
                        data: [],
                    };
                    storages[storageId].data.push(...data);
                }
                console.log(storages);
                setRunState((runState) => ({
                    ...runState,
                    storages,
                }));
            };

            const step = bot.steps[currStep];
            let res;
            // console.log('start step:', currStep);
            if (step.context === 'popup') {
                const { runMethod } = stepTemplates[step.id];
                res = await runMethod({
                    step,
                    tabId: tab.id,
                    updateCurrentTab,
                    updateStorage,
                });
            } else if (step.context === 'content') {
                res = await chrome.tabs.sendMessage(tab.id, {
                    reason: MsgReasons.RunStep,
                    step,
                });
            }
            // console.log('end step:', currStep, res);

            if (
                (res.success || step.settings.skipIfFailed) &&
                currStep < bot.steps.length - 1
            ) {
                setRunState((state) => ({
                    ...state,
                    isRunning: true,
                    currStep: state.currStep + 1,
                }));
            } else {
                if (bot.settings.focusBotWindowAfterExec) {
                    focusCurrentWindow();
                }
                openPreviewModal();
            }

            // console.log(runState.storages);
        })();
    }, [runState.tab?.status, runState.isRunning]);

    useEffect(() => {
        if (bot && isRunningBot) {
            runBot();
            setIsRunningBot(false);
        }
    }, [isRunningBot, bot]);

    // console.log(runState);

    return bot && (

        <Container
            p="lg"
            style={{ margin: '1rem auto' }}
        >
            <Flex
                justify="space-between"
                align="center"
                gap="lg"
            >
                <Flex
                    align="center"
                    gap="xs"
                    style={{ width: '100%' }}
                >
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={goToHome}
                    >
                        <IconArrowLeft />
                    </ActionIcon>

                    <TextInput
                        size="lg"
                        variant="unstyled"
                        value={bot.name}
                        onChange={(e) => {
                            setBot({
                                ...bot,
                                name: e.target.value,
                            });
                        }}
                        style={{ width: '100%' }}
                    />
                </Flex>

                <Flex
                    align="center"
                    gap="xs"
                >
                    <Button
                        variant="light"
                        color="green"
                        onClick={runBot}
                        justify="center"
                        rightSection={
                            <IconPlayerPlayFilled size="14" />
                        }
                    >
                        Run
                    </Button>

                    <Button
                        variant="light"
                        onClick={() => {
                            saveBot(bot);
                            goToHome();
                        }}
                        justify="center"
                        leftSection={
                            <IconDeviceFloppy size="16" />
                        }
                    >
                        Save
                    </Button>

                    <ActionIcon
                        variant="light"
                        color="yellow"
                        onClick={openSettingsModal}
                        size="lg"
                    >
                        <IconSettings />
                    </ActionIcon>
                </Flex>
            </Flex>

            <Divider mt="lg" />

            {bot.steps.map((step, i) => (
                <StepForm
                    key={step.uid}
                    index={i + 1}
                    bot={bot}
                    setBot={setBot}
                    step={step}
                    setStep={(step) => setStep(step, i)}
                    addStep={() => {
                        setStepInsertIndex(i);
                        openDrawer();
                    }}
                    copyStep={() => copyStep(i)}
                    deleteStep={() => deleteStep(i)}
                />
            ))}

            <Flex justify="center" mt="xl">
                <Button
                    leftSection={<IconPlus size="1rem" />}
                    // compact
                    radius="xl"
                    onClick={openDrawer}
                    styles={{
                        leftIcon: { marginRight: '5px' }
                    }}
                >
                    Add a step
                </Button>
            </Flex>

            <Modal
                title="Bot Settings"
                opened={settingsModalOpened}
                // onClose={discardCloseSettingsModal}
                centered
                withCloseButton={false}
            >
                <Switch
                    label="Open in new window"
                    name="openInNewWindow"
                    checked={botSettings.openInNewWindow}
                    onChange={handleSettingsChange}
                    mt="sm"
                />

                {botSettings.openInNewWindow && (
                    <TextInput
                        label="New Window URL"
                        name="windowUrl"
                        value={botSettings.windowUrl}
                        onChange={handleSettingsChange}
                        styles={{
                            label: { marginBottom: '0.25rem' }
                        }}
                        mt="sm"
                    />
                )}

                <Switch
                    label="Focus Bot Window After Execution"
                    name="focusBotWindowAfterExec"
                    checked={botSettings.focusBotWindowAfterExec}
                    onChange={handleSettingsChange}
                    my="lg"
                />

                <Flex
                    align="center"
                    gap="xs"
                    mt="lg"
                >
                    <Text fw="bold">
                        Shortcut Key
                    </Text>

                    <ActionIcon
                        variant="subtle"
                        size="xs"
                        onClick={() => {
                            setIsListeningToKeys(true);
                            setTempShortcutKey('');
                        }}
                        disabled={isListeningToKeys}
                    >
                        <IconEdit />
                    </ActionIcon>

                    <ActionIcon
                        variant="subtle"
                        color="red"
                        size="xs"
                        onClick={() => {
                            setBotSettings((settings) => ({
                                ...settings,
                                shortcutKey: '',
                            }));
                        }}
                        disabled={isListeningToKeys || !botSettings.shortcutKey}
                    >
                        <IconTrash />
                    </ActionIcon>
                </Flex>

                <ShortcutKey
                    shortcutKey={isListeningToKeys
                        ? tempShortcutKey
                        : botSettings.shortcutKey
                    }
                    showNone={!isListeningToKeys}
                />

                {isListeningToKeys && (
                    <>
                        <Text mt="xs" fz="sm" fs="italic">
                            Enter shortcut key(s)
                        </Text>

                        <Flex gap="xs" mt="sm">
                            <Button
                                variant="light"
                                color="green"
                                size="compact-xs"
                                onClick={() => {
                                    setBotSettings((settings) => ({
                                        ...settings,
                                        shortcutKey: tempShortcutKey,
                                    }));
                                    setIsListeningToKeys(false);
                                }}
                                disabled={!tempShortcutKey}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant="light"
                                color="yellow"
                                size="compact-xs"
                                onClick={() => setIsListeningToKeys(false)}
                            >
                                Cancel
                            </Button>
                        </Flex>
                    </>
                )}

                <Flex
                    justify="space-between"
                    align="center"
                    mt="lg"
                    mb="xs"
                >
                    <Text fw="bold">
                        Run on page load
                    </Text>

                    <Switch
                        name="runOnPageLoad"
                        checked={botSettings.runOnPageLoad}
                        onChange={handleSettingsChange}
                    />
                </Flex>

                {botSettings.runOnPageLoad && (
                    <>
                        <Textarea
                            description={
                                <>
                                    List all URLs where this bot will be run when the page is loaded.
                                    <br />
                                    (Enter each URL on separate line)
                                </>
                            }
                            placeholder="Enter each URL on separate line"
                            name="runOnStartUrlList"
                            value={botSettings.runOnStartUrlList.join('\n')}
                            onChange={handleSettingsChange}
                            autosize
                            minRows={3}
                            maxRows={4}
                        />

                        <Switch
                            label="Match Host Name Only"
                            name="runOnStartUrlMatchHostNameOnly"
                            checked={botSettings.runOnStartUrlMatchHostNameOnly}
                            onChange={handleSettingsChange}
                            mt="sm"
                        />
                    </>
                )}

                <Flex justify="end" gap="xs" mt="lg">
                    <Button
                        variant="light"
                        color="green"
                        onClick={saveSettings}
                        justify="center"
                        leftSection={
                            <IconCheck size="16" />
                        }
                        disabled={isListeningToKeys}
                    >
                        Save
                    </Button>

                    <Button
                        variant="light"
                        color="red"
                        onClick={discardCloseSettingsModal}
                        justify="center"
                        leftSection={
                            <IconX size="16" />
                        }
                        disabled={isListeningToKeys}
                    >
                        Cancel
                    </Button>
                </Flex>
            </Modal>

            <Drawer
                title={<Text fz="xl">Add Step</Text>}
                opened={isDrawerOpen}
                onClose={closeDrawer}
                position="bottom"
            >
                {Object.values(stepTemplates).map((stepTemplate) => (

                    <Card
                        key={stepTemplate.id}
                        onClick={() => {
                            setStep(getStepTemplate(stepTemplate.id), bot.steps.length);
                            setStepInsertIndex(-1);
                            closeDrawer();
                        }}
                        style={{
                            marginBottom: '1rem',
                            cursor: 'pointer',
                        }}
                    >
                        <Text fw="bold">
                            {stepTemplate.title}
                        </Text>

                        <Text fz="sm">
                            {stepTemplate.description}
                        </Text>
                    </Card>
                ))}
            </Drawer>

            {Object.keys(runState.storages).length !== 0 && (
                <Modal
                    title="Extracted Data"
                    opened={previewModalOpened}
                    onClose={closePreviewModal}
                    size="xl"
                    centered
                >
                    <ResultData storages={runState.storages} />
                </Modal>
            )}
        </Container>
    );
}

export default BotForm;