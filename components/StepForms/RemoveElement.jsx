import {
    Button,
    Divider,
    Flex,
    NumberInput,
    Select,
    Switch,
    TextInput,
} from '@mantine/core';
import { focusCurrentWindow, getActiveTab } from '~utils/helper';
import { ContentUIs, MsgReasons, SelectorTypes } from '~enums';

const RemoveElement = ({ step, setStep }) => {

    const {
        selector,
        selectorType,
        retryCount,
        retryDelay,
        retryInfinitely,
    } = step.settings;

    const updateSettings = (key, value) => {
        const updatedStep = { ...step };
        if (key === 'selectorType' && updatedStep.settings.selectorType !== value) {
            updatedStep.settings.selector = '';
        }
        updatedStep.settings[key] = value;
        setStep(updatedStep);
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const val = type === 'checkbox' ? checked : value;
        updateSettings(name, val);
    };

    const startElementSelectorMode = async () => {

        const tab = await getActiveTab(true);
        const { success, XPath, cssSelector } = await chrome.tabs.sendMessage(tab.id, {
            reason: MsgReasons.ShowUI,
            component: ContentUIs.ElementSelector,
        });

        if (success) {
            const updatedStep = { ...step };
            updatedStep.settings.selector = selectorType === SelectorTypes.XPath ? XPath : cssSelector;
            setStep(updatedStep);
        }

        focusCurrentWindow();
    };

    return (

        <>
            <Flex gap="sm" mt="xl" mb="xs">
                <Select
                    label="Selector Type"
                    value={selectorType}
                    onChange={(value) => updateSettings('selectorType', value)}
                    data={Object.entries(SelectorTypes).map(([label, value]) => (
                        { label, value }
                    ))}
                    allowDeselect={false}
                />

                <TextInput
                    label="Enter a selector for the element"
                    name="selector"
                    value={selector}
                    onChange={handleChange}
                    style={{ flexGrow: 1 }}
                    labelProps={{
                        style: { marginBottom: '0.25rem' }
                    }}
                />
            </Flex>

            <Button
                variant="light"
                onClick={startElementSelectorMode}
            >
                Select Element
            </Button>

            <Divider my="lg" />

            <Switch
                label="Retry Infinitely"
                name="retryInfinitely"
                checked={retryInfinitely}
                onChange={handleChange}
                mb="sm"
            />

            <Flex gap="sm" mb="md">
                <NumberInput
                    label="Retry Count"
                    description="Number of retry attempts if failed to find the element"
                    value={retryCount}
                    onChange={(value) => updateSettings('retryCount', value)}
                    min={0}
                    allowDecimal={false}
                    w="100%"
                    disabled={retryInfinitely}
                />

                <NumberInput
                    label="Retry Delay (in milliseconds)"
                    description="Delay between each retry attempt (should be >100)"
                    value={retryDelay}
                    onChange={(value) => updateSettings('retryDelay', value)}
                    suffix=" ms"
                    min={100}
                    allowDecimal={false}
                    w="100%"
                />
            </Flex>
        </>
    );
}

export default RemoveElement;