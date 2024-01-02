import {
    Button,
    TextInput,
} from '@mantine/core';
import { getActiveTab, focusCurrentWindow } from '~utils/helper';
import { ContentUIs, MsgReasons } from '~enums';

const EnterText = ({ step, setStep }) => {

    const handleChange = (e) => {
        let { name, value } = e.target;
        const updatedStep = { ...step };
        // if (name === 'openInNewTab') {
        //     value = e.currentTarget.checked;
        // }
        updatedStep.settings[name] = value;
        setStep(updatedStep);
    };

    const startElementSelectorMode = async () => {

        const tab = await getActiveTab(true);
        const { success, XPath } = await chrome.tabs.sendMessage(tab.id, {
            reason: MsgReasons.ShowUI,
            component: ContentUIs.ElementSelector,
            elementType: 'input',
        });

        if (success) {
            const updatedStep = { ...step };
            updatedStep.settings.XPath = XPath;
            setStep(updatedStep);
        }

        focusCurrentWindow();
    };

    return (

        <>
            <TextInput
                label="Enter XPath of input element"
                mt="xl"
                mb="xs"
                name="XPath"
                value={step.settings.XPath}
                onChange={handleChange}
                labelProps={{
                    style: { marginBottom: '0.25rem' }
                }}
            />

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