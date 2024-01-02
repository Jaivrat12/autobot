import { Text } from '@mantine/core';

const WaitForConfirmation = ({ step, setStep }) => {

    return (
        <Text my="xl" size="sm">
            Wait until the user takes some action and allows the bot to continue.
        </Text>
    );
}

export default WaitForConfirmation;