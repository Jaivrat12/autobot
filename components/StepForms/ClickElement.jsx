import {
    Button,
    Flex,
    Select,
    TextInput,
} from '@mantine/core';
import { focusCurrentWindow, getActiveTab } from '~utils/helper';
import { ContentUIs, MsgReasons, SelectorTypes } from '~enums';

const ClickElement = ({ step, setStep }) => {

    const { selector, selectorType } = step.settings;

    const updateSettings = (name, value) => {
        const updatedStep = { ...step };
        if (name === 'selectorType' && updatedStep.settings.selectorType !== value) {
            updatedStep.settings.selector = '';
        }
        updatedStep.settings[name] = value;
        setStep(updatedStep);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateSettings(name, value);
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
                mb="xl"
                variant="light"
                onClick={startElementSelectorMode}
            >
                Select Element
            </Button>
        </>
    );
}

export default ClickElement;