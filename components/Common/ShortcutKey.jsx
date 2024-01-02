import React from 'react';
import { Kbd, Text } from '@mantine/core';

const ShortcutKey = ({ shortcutKey, showNone = false }) => {

    if (!shortcutKey) {
        if (showNone) {
            return (
                <Text c="dimmed" fs="italic">
                    None
                </Text>
            );
        } else return null;
    }

    const keys = shortcutKey.split('+');
    return (
        <div>
            {keys.map((key, i) => (
                <React.Fragment key={key}>
                    <Kbd>{key}</Kbd>
                    {keys.length !== i + 1 && ' + '}
                </React.Fragment>
            ))}
        </div>
    );
};

export default ShortcutKey;