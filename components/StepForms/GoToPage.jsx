import {
    Button,
    Select,
    Switch,
    TextInput,
} from '@mantine/core';
import {
    focusCurrentWindow,
    getActiveTab,
} from '~utils/helper';

const GoToPage = ({ bot, step, setStep }) => {

    const { dataSourceType, storageId } = step.settings;

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
            <Select
                label="Select Source"
                name="dataSourceType"
                value={dataSourceType}
                data={[
                    { value: 'storage', label: 'Use Storage' },
                    { value: 'manual', label: 'Enter Manually' },
                ]}
                onChange={(type) => handleChange({
                    target: {
                        name: 'dataSourceType',
                        value: type,
                    }
                })}
                allowDeselect={false}
                mt="xl"
                mb="xs"
            />

            {dataSourceType === 'storage' && (
                <Select
                    label="Select Storage to Get URL From"
                    value={String(storageId)}
                    data={bot?.storages?.variables?.map(({ id, name }) => ({
                        label: name,
                        value: String(id),
                    }))}
                    onChange={(storageId) => handleChange({
                        target: {
                            name: 'storageId',
                            value: Number(storageId),
                        }
                    })}
                    allowDeselect={false}
                />
            )}

            {dataSourceType === 'manual' && (
                <>
                    <TextInput
                        label="Enter Page URL"
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
                </>
            )}

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