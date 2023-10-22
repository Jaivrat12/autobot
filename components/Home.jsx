import { ActionIcon, Button, Card, Container, Divider, Flex, Text, Title } from '@mantine/core';
import { IconDotsCircleHorizontal, IconPlayerPlay, IconPlus } from '@tabler/icons-react';

const Home = () => {

    return (

        <Container
            p="lg"
            style={{
                width: '24rem',
                height: '36rem',
            }}
        >
            <Flex
                justify="space-between"
                align="center"
                mb="lg"
            >
                <Title order={2} fw="normal">
                    Autobot
                </Title>

                <Button
                    leftIcon={<IconPlus />}
                >
                    New Bot
                </Button>
            </Flex>

            <Divider my="lg" />

            <Flex>
                <Card
                    shadow="sm"
                    padding="xs"
                    radius="md"
                    withBorder
                    style={{ width: '100%' }}
                >
                    <Flex justify="space-between">
                        <Text>
                            Bot 1
                        </Text>
                        <Flex>
                            <ActionIcon>
                                <IconPlayerPlay size="1.125rem" />
                            </ActionIcon>
                            <ActionIcon>
                                <IconDotsCircleHorizontal size="1.125rem" />
                            </ActionIcon>
                        </Flex>
                    </Flex>
                </Card>
            </Flex>
        </Container>
    );
}

export default Home;