import { TextInput } from '@mantine/core';

const Wait = ({ step, setStep }) => {

    const handleChange = (e) => {
        let { name, value } = e.target;
        const updatedStep = { ...step };
        if (name === 'time' && value) {
            value = Math.max(value, 0);
        }
        updatedStep.settings[name] = value;
        setStep(updatedStep);
    };

    return (

        <TextInput
            label="Set a time in seconds"
            mt="xl"
            mb="xs"
            name="time"
            type="number"
            value={step.settings.time}
            onChange={handleChange}
            labelProps={{
                style: { marginBottom: '0.25rem' }
            }}
        />
    );
}

export default Wait;