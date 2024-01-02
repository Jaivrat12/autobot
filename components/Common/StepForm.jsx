import { useState } from 'react';
import { useHover } from '@mantine/hooks';
import {
    ActionIcon,
    Button,
    Card,
    Flex,
    Text,
} from '@mantine/core';
import {
    IconChevronDown,
    IconChevronUp,
} from '@tabler/icons-react';
import {
    IconPlus,
    IconTrash,
} from '@tabler/icons-react';
import stepTemplates from '~utils/stepTemplates';

const StepForm = ({ index, step, addStep, deleteStep, ...props }) => {

    const [isCollapsed, setIsCollapsed] = useState(true);

    const { hovered: stepHovered, ref: stepRef } = useHover();
    const StepForm = stepTemplates[step.id].component;

    return (

        <div
            style={{ margin: '0.5rem 0' }}
            ref={stepRef}
        >
            <Button
                size="xs"
                variant="light"
                // compact
                leftSection={<IconPlus size="0.75rem" />}
                onClick={addStep}
                style={{
                    display: 'block',
                    margin: '0 auto 0.5rem',
                    visibility: stepHovered ? 'visible' : 'hidden',
                    borderRadius: '1rem',
                }}
                styles={{
                    leftIcon: { marginRight: '5px' }
                }}
            >
                Add a step
            </Button>

            <Card>
                <Flex
                    justify="space-between"
                    align="center"
                    onClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
                    style={{ cursor: 'pointer' }}
                >
                    <Flex align="center" gap="xs">
                        <Text
                            style={{
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                minWidth: '1.5rem',
                                minHeight: '1.5rem',
                                padding: '0 6px',
                                border: '2px solid #aaa4',
                                borderRadius: '100px',
                                fontSize: '13px',
                            }}
                        >
                            {index}
                        </Text>

                        <Text>
                            {step.title}
                        </Text>
                    </Flex>

                    <Flex align="center" gap="xs">
                        {isCollapsed ? (
                            <IconChevronDown />
                        ) : (
                            <IconChevronUp />
                        )}

                        <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteStep();
                            }}
                        >
                            <IconTrash />
                        </ActionIcon>
                    </Flex>
                </Flex>

                {!isCollapsed && (

                    <StepForm
                        index={index}
                        step={step}
                        { ...props }
                    />
                )}
            </Card>
        </div>
    );
}

export default StepForm;