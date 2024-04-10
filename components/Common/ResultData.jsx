import { useState } from 'react';
import {
    ActionIcon,
    CopyButton,
    Flex,
    Select,
    Tooltip,
} from '@mantine/core';
import DisplayData from './DisplayData';
import {
    IconCheck,
    IconCopy,
    IconDownload,
} from '@tabler/icons-react';

const toJSON = (storage) => {

    let json = {};
    if (storage.type !== 'table') {
        json[storage.name] = storage.type === 'variable'
            ? storage.data[0]
            : storage.data;
    } else {
        const columns = storage.metadata.map(({ columnName }) => columnName);
        json = storage.data.map((row) => {
            const obj = {};
            columns.forEach((col, i) => obj[col] = row[i]);
            return obj;
        });
    }
    return JSON.stringify(json);
};

const toCSV = (storage) => {

    let obj = JSON.parse(toJSON(storage));
    if (!Array.isArray(obj)) {
        obj = [obj];
    }
    if (storage.type === 'array') {
        const key = Object.keys(obj[0])[0]
        obj = obj[0][key].map((item) => ({ [key]: item }));
    }

    const rows = [];
    rows.push(Object.keys(obj[0]));
    obj.forEach((item) => {
        rows.push(Object.values(item));
    });

    let csvContent = '';
    rows.forEach((row) => {
        const formattedRow = row.map((item) => `"${item.replaceAll('"', '""')}"`);
        csvContent += formattedRow.join(',') + '\n';
    });
    return csvContent;
};

const ResultData = ({ storages }) => {

    const [storageId, setStorageId] = useState(Object.values(storages)[0]?.id);
    const storage = storages[storageId];

    const [fileFormat, setFileFormat] = useState('csv');
    const content = fileFormat === 'csv'
        ? toCSV(storage)
        : toJSON(storage);

    const fileName = `${storage.name}.${fileFormat}`;
    const blob = new Blob([content], { type: `text/${fileFormat};charset=utf-8,` });
    const objUrl = URL.createObjectURL(blob);

    return (

        <>
            <Flex align="end" gap="sm" mb="lg">
                <Select
                    label="Select Data Storage"
                    value={String(storageId)}
                    onChange={setStorageId}
                    data={Object.values(storages).map((storage) => ({
                        value: storage.id.toString(),
                        label: storage.name,
                    }))}
                    allowDeselect={false}
                    style={{ flexGrow: 1 }}
                />

                <Select
                    label="Downlaod as"
                    value={fileFormat}
                    onChange={setFileFormat}
                    data={[
                        { value: 'csv', label: 'Spreadsheet (.csv)' },
                        { value: 'json', label: 'JSON' },
                        // { value: 'txt', label: 'Plain text' },
                    ]}
                    allowDeselect={false}
                />

                <ActionIcon
                    variant="light"
                    size="36"
                    component="a"
                    href={objUrl}
                    download={fileName}
                >
                    <IconDownload size="24" />
                </ActionIcon>

                <CopyButton value={content} timeout={2000}>
                    {({ copied, copy }) => (
                        <Tooltip
                            label={copied ? 'Copied' : 'Copy'}
                            position="right"
                            withArrow
                        >
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                variant="light"
                                size="36"
                                onClick={copy}
                            >
                                {copied ? (
                                    <IconCheck size="24" />
                                ) : (
                                    <IconCopy size="24" />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
            </Flex>

            <div style={{ overflowX: 'scroll' }}>
                {storage && (
                    <DisplayData
                        key={storage?.id}
                        storageName={storage?.name}
                        storageType={storage?.type}
                        data={storage?.data}
                        metadata={storage?.metadata}
                    />
                )}
            </div>
        </>
    );
}

export default ResultData;