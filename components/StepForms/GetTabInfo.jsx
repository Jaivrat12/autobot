import { Flex, Select } from '@mantine/core';
import SelectStorage from '~Components/Common/SelectStorage';
import { SelectorDataTypes } from '~enums';

const GetTabInfo = ({ bot, setBot, step, setStep }) => {

    const { storageId, storageType } = step.settings;
    const storage = bot?.storages?.[storageType + 's']?.find(({ id }) => id === storageId);

    const propToDataTypes = {
        title: SelectorDataTypes.Text,
        url: SelectorDataTypes.Text,
        favIconUrl: SelectorDataTypes.Image,
    }

    const handleChange = (name, value) => {
        const updatedStep = { ...step };
        updatedStep.settings[name] = value;
        updatedStep.settings.data.type = propToDataTypes[step.settings.tabProp];
        setStep(updatedStep);
    };

    return (

        <Flex direction="column" gap="md" my="xl">
            <SelectStorage
                bot={bot}
                setBot={setBot}
                storage={storage}
                setStorage={({ id }) => handleChange('storageId', id)}
                storageTypes={['variables']}
            />

            <Select
                label="Info Key"
                name="tabProp"
                value={step.settings.tabProp}
                data={[
                    { value: 'title', label: 'Title' },
                    { value: 'url', label: 'URL' },
                    { value: 'favIconUrl', label: 'Icon' },
                ]}
                onChange={(tabProp) => handleChange('tabProp', tabProp)}
                allowDeselect={false}
            />
        </Flex>
    );
}

export default GetTabInfo;