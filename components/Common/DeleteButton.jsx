import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, ActionIcon, Text, Flex } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

const DeleteButton = ({ content, onConfirm }) => {

    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Text fw="bold">
                        Confirm Bot Deletion
                    </Text>
                }
                centered
            >
                <Text mb="md">
                    {content}
                </Text>

                <Flex justify="end" gap="xs">
                    <Button
                        variant="light"
                        onClick={close}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="red"
                        onClick={onConfirm}
                        leftSection={<IconTrash size="1.125rem" />}
                    >
                        Delete
                    </Button>
                </Flex>
            </Modal>

            <ActionIcon
                color="red"
                variant="subtle"
                onClick={open}
            >
                <IconTrash size="1.125rem" />
            </ActionIcon>
        </>
    );
};

export default DeleteButton;