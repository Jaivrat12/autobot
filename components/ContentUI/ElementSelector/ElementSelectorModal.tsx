import type { MouseEventHandler } from 'react';
import { ActionIcon, Button } from '@mantine/core';
import Draggable from 'react-draggable';
import { IconEye, IconEyeCancel } from '@tabler/icons-react';
import { getElementFullName } from '~utils/helper';

type ElementSelectorModalProps = {
    selectedElement: Element | null;
    confirm: MouseEventHandler<HTMLButtonElement>;
    cancel: MouseEventHandler<HTMLButtonElement>;
    showOverlay: boolean;
    toggleShowOverlay: () => void;
};

const ElementSelectorModal = ({
    selectedElement,
    confirm,
    cancel,
    showOverlay,
    toggleShowOverlay
}: ElementSelectorModalProps) => {

    const elementName = selectedElement
        ? getElementFullName(selectedElement)
        : '';

    return (
        <Draggable>
            <div
                style={{
                    zIndex: 99999999,
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    padding: '1rem',
                    background: '#fff',
                    color: 'black',
                    width: '300px',
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h1
                        style={{
                            color: 'black',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                        }}
                    >
                        Autobot
                    </h1>

                    <ActionIcon onClick={toggleShowOverlay}>
                        {showOverlay ? (
                            <IconEyeCancel />
                        ) : (
                            <IconEye />
                        )}
                    </ActionIcon>
                </div>

                <p
                    style={{
                        color: 'black',
                        fontStyle: !elementName ? 'italic' : 'normal',
                        wordBreak: 'break-all',
                    }}
                >
                    {elementName || 'No element selected...'}
                </p>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.25rem',
                    }}
                >
                    <Button
                        onClick={confirm}
                        disabled={!selectedElement}
                    >
                        Confirm
                    </Button>

                    <Button onClick={cancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </Draggable>
    );
}

export default ElementSelectorModal;