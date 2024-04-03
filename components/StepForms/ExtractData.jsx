import { useEffect, useState } from 'react';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import {
    ActionIcon,
    Button,
    Divider,
    Flex,
    Modal,
    Select,
    Text,
    TextInput,
} from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import DisplayData from '~components/Common/DisplayData';
import SelectStorage from '~components/Common/SelectStorage';
import { ContentUIs, MsgReasons, SelectorDataTypes, SelectorTypes } from '~enums';
import { extractData, focusCurrentWindow, getActiveTab } from '~utils/helper';

const getDataInit = (storageType) => ({
    selector: '',
    type: '',
    ...(storageType === 'table' && { columnName: '' }),
});

const ExtractData = ({ bot, setBot, step, setStep }) => {

    const { storageId, storageType } = step.settings;
    const storage = bot?.storages?.[storageType + 's']?.find(({ id }) => id === storageId);

    const [previewModalOpened, { open: openPreviewModal, close: closePreviewModal }] = useDisclosure(false);
    const [dataPreview, setDataPreview] = useState(null);

    const handleChange = (name, value) => {
        const updatedStep = { ...step };
        updatedStep.settings[name] = value;
        setStep(updatedStep);
    };

    const handleDataChange = (name, value) => {
        const updatedStep = { ...step };
        updatedStep.settings.data[name] = value;
        setStep(updatedStep);
    };

    const setStorage = (storage) => {
        const isTable = storage.type === 'table';
        const data = getDataInit(storage.type);
        handleChange('data', isTable ? [data] : data);
        handleChange('storageId', storage.id);
        handleChange('storageType', storage.type);
    };

    const addColumn = () => {

        if (step.settings.data.length > 0 && !step.settings.data.slice(-1)[0].columnName) {
            return;
        }

        const updatedStep = { ...step };
        updatedStep.settings.data.push(getDataInit(storage.type));
        setStep(updatedStep);
    };

    const setColumn = (index, prop, value) => {

        if (step.settings.data.find(({ columnName }) => columnName === value)) {
            value = '';
        }

        const updatedStep = { ...step };
        updatedStep.settings.data[index][prop] = value;
        setStep(updatedStep);
    };

    const deleteColumn = (index) => {
        const updatedStep = { ...step };
        updatedStep.settings.data.splice(index, 1);
        setStep(updatedStep);
    };

    const startElementSelectorMode = async (columnIndex) => {

        const tab = await getActiveTab(true);
        const { success, cssSelector } = await chrome.tabs.sendMessage(tab.id, {
            reason: MsgReasons.ShowUI,
            component: ContentUIs.ElementSelector,
            multiple: storageType !== 'variable',
        });

        if (success) {
            const updatedStep = { ...step };
            if (columnIndex !== undefined) {
                updatedStep.settings.data[columnIndex].selector = cssSelector;
            } else {
                updatedStep.settings.data.selector = cssSelector;
            }
            setStep(updatedStep);
        }

        focusCurrentWindow();
    };

    const previewData = async () => {

        openPreviewModal();
        setDataPreview(null);

        const tab = await getActiveTab();
        const data = await extractData(step, tab.id);
        setDataPreview(data);

        focusCurrentWindow();
    };

    return bot && (

        <>
            <Modal
                title="Preview Data"
                opened={previewModalOpened}
                onClose={closePreviewModal}
                size="xl"
                centered
            >
                <DisplayData
                    storageName={storage?.name}
                    storageType={storageType}
                    data={dataPreview}
                    metadata={step.settings.data}
                />
            </Modal>

            <div style={{ margin: '2rem 0' }}>
                <SelectStorage
                    bot={bot}
                    setBot={setBot}
                    storage={storage}
                    setStorage={setStorage}
                />
            </div>

            {step.settings.storageType !== 'table' ? (
                <>
                    <Flex align="end" gap="sm">
                        <TextInput
                            label="Enter CSS Selector of element"
                            value={step.settings.data.selector}
                            onChange={(e) => handleDataChange('selector', e.target.value)}
                            labelProps={{
                                style: { marginBottom: '0.25rem' }
                            }}
                            style={{ width: '70%' }}
                        />

                        <Button
                            variant="light"
                            onClick={() => startElementSelectorMode()}
                            style={{ width: '30%' }}
                        >
                            Select Element{step.settings.storageType !== 'variable' && 's'}
                        </Button>
                    </Flex>

                    <Flex align="end" gap="sm">
                        <Select
                            label="Data Type"
                            value={step.settings.data.type}
                            onChange={(value) => handleDataChange('type', value)}
                            data={[
                                { label: 'Text', value: SelectorDataTypes.Text },
                                { label: 'Href (URL)', value: SelectorDataTypes.Link },
                                { label: 'Image', value: SelectorDataTypes.Image },
                            ]}
                            style={{ width: '70%' }}
                        />

                        <Button
                            variant="light"
                            onClick={previewData}
                            style={{ width: '30%' }}
                        >
                            Preview Data
                        </Button>
                    </Flex>
                </>
            ) : (
                <>
                    {step.settings.data.map((column, i) => (

                        <div key={column.columnName}>
                            <Flex align="center" gap="xs">
                                <Text size="lg">
                                    Column #{i}
                                </Text>

                                <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    size="1.15rem"
                                    onClick={() => deleteColumn(i)}
                                >
                                    <IconTrash />
                                </ActionIcon>
                            </Flex>

                            <Flex align="end" gap="sm">
                                <Select
                                    label="Select Column"
                                    data={storage.data.map((col) => ({
                                        value: col,
                                        label: col,
                                        disabled: step.settings.data.find(({ columnName }) => columnName === col),
                                    }))}
                                    value={column.columnName}
                                    onChange={(value) => setColumn(i, 'columnName', value)}
                                    allowDeselect={false}
                                />

                                <Select
                                    label="Data Type"
                                    value={column.type}
                                    onChange={(value) => setColumn(i, 'type', value)}
                                    data={[
                                        { label: 'Text', value: SelectorDataTypes.Text },
                                        { label: 'Href (URL)', value: SelectorDataTypes.Link },
                                        { label: 'Image', value: SelectorDataTypes.Image },
                                    ]}
                                    allowDeselect={false}
                                />

                                <TextInput
                                    label="Enter CSS Selector of element"
                                    value={column.selector}
                                    onChange={(e) => setColumn(i, 'selector', e.target.value)}
                                    labelProps={{
                                        style: { marginBottom: '0.25rem' }
                                    }}
                                    style={{ flexGrow: 1 }}
                                />

                                <Button
                                    variant="light"
                                    onClick={() => startElementSelectorMode(i)}
                                >
                                    Select Elements
                                </Button>
                            </Flex>

                            <Divider my="md" />
                        </div>
                    ))}

                    <Flex gap="sm">
                        <Button
                            onClick={addColumn}
                            w="50%"
                        >
                            Add Column
                        </Button>

                        <Button
                            variant="light"
                            onClick={previewData}
                            w="50%"
                        >
                            Preview Table
                        </Button>
                    </Flex>
                </>
            )}
        </>
    );
}

export default ExtractData;