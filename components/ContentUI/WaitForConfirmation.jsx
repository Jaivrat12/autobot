import { Button, MantineProvider } from '@mantine/core';

const WaitForConfirmation = ({ sendResponse }) => {

    return (

        <MantineProvider>
            <div
                style={{
                    zIndex: 99999999,
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem',
                    // background: '#fff',
                }}
            >
                <Button onClick={() => sendResponse({ success: true })}>
                    Continue Autobot
                </Button>
            </div>
            </MantineProvider>
    );
}

export default WaitForConfirmation;