import {
    Button,
    Flex,
    Select,
    TextInput,
} from '@mantine/core';
import { getActiveTab, focusCurrentWindow } from '~utils/helper';
import { ContentUIs, MsgReasons, SelectorTypes } from '~enums';

const EnterText = ({ step, setStep }) => {

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
            elementType: 'input',
        });

        if (success) {
            const updatedStep = { ...step };
            updatedStep.settings.selector = step.settings.selectorType === SelectorTypes.XPath ? XPath : cssSelector;
            setStep(updatedStep);
        }

        focusCurrentWindow();
    };

    return (

        <>
            <Flex gap="sm" mt="xl" mb="xs">
                <Select
                    label="Selector Type"
                    value={step.settings.selectorType}
                    onChange={(value) => updateSettings('selectorType', value)}
                    data={Object.entries(SelectorTypes).map(([label, value]) => (
                        { label, value }
                    ))}
                    allowDeselect={false}
                />

                <TextInput
                    label="Enter a selector for the element"
                    name="selector"
                    value={step.settings.selector}
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

            <TextInput
                label="Input the text to enter"
                my="xl"
                name="text"
                value={step.settings.text}
                onChange={handleChange}
                labelProps={{
                    style: { marginBottom: '0.25rem' }
                }}
            />

            {/* <Switch
                label="Open in new tab"
                my="xl"
                name="openInNewTab"
                checked={step.settings.openInNewTab}
                onChange={handleChange}
            /> */}
        </>
    );
}

export default EnterText;