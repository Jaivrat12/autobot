import { useState } from 'react';
import {
    Button,
    Flex,
    Modal,
    Select,
    TagsInput,
    TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const getStorageInit = (type) => {

    const dataInit = {
        variable: '',
        array: [],
        table: ['Column Name'],
    };

    return {
        type,
        name: type,
        data: dataInit[type],
    };
};

const AddNewStorage = ({ addStorage }) => {

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [storage, setStorage] = useState(getStorageInit('variable'));

    const handleChange = (prop, value) => {
        setStorage({
            ...storage,
            [prop]: value,
        });
    };

    return (

        <>
            <Button onClick={openModal}>
                Add New Storage
            </Button>

            <Modal
                title="Add New Storage"
                opened={modalOpened}
                onClose={closeModal}
                centered
            >
                <Flex direction="column" gap="xs">
                    <Select
                        label="Storage Type"
                        value={storage.type}
                        data={[
                            { value: 'variable', label: 'Variable (Single Value)' },
                            { value: 'array', label: 'Array (Multiple Values)' },
                            { value: 'table', label: 'Table (Rows & Columns)' },
                        ]}
                        onChange={(type) => setStorage(getStorageInit(type))}
                        allowDeselect={false}
                    />

                    <TextInput
                        label="Name"
                        value={storage.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                    />

                    {storage.type === 'table' && (
                        <TagsInput
                            label="Table Columns"
                            value={storage.data}
                            onChange={(columns) => handleChange('data', columns)}
                        />
                    )}

                    <Button
                        variant="light"
                        onClick={() => {
                            addStorage(storage);
                            closeModal();
                        }}
                        mt="md"
                    >
                        Save
                    </Button>
                </Flex>
            </Modal>
        </>
    );
}

export default AddNewStorage;