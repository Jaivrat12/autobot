import {
    Button,
    Switch,
    TextInput,
} from '@mantine/core';
import {
    focusCurrentWindow,
    getActiveTab,
} from '~utils/helper';

const GoToPage = ({ step, setStep }) => {

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        const updatedStep = { ...step };
        updatedStep.settings[name] = type === 'checkbox' ? checked : value;
        setStep(updatedStep);
    };

    const getCurrentUrl = async () => {
        const tab = await getActiveTab();
        const updatedStep = { ...step };
        updatedStep.settings.pageURL = tab.url;
        setStep(updatedStep);
        focusCurrentWindow();
    };

    return (

        <>
            <TextInput
                label="Enter Page URL"
                mt="xl"
                mb="xs"
                name="pageURL"
                value={step.settings.pageURL}
                onChange={handleChange}
                labelProps={{
                    style: { marginBottom: '0.25rem' }
                }}
            />

            <Button
                variant="light"
                onClick={getCurrentUrl}
            >
                Get Current URL
            </Button>

            <Switch
                label="Open in new tab"
                my="xl"
                name="openInNewTab"
                checked={step.settings.openInNewTab}
                onChange={handleChange}
            />
        </>
    );
}

export default GoToPage;