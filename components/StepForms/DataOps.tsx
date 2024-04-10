import { Flex, Select, TextInput } from '@mantine/core';

type RegexProps = {
	bot: any;
	step: any;
	setStep: (step: any) => any;
};

const DataOps = ({ bot, step, setStep }: RegexProps) => {
	const {
        inputStorageId,
        operator,
        storageId,
    } = step.settings;

	const handleChange = (name: string, value: any) => {
		const updatedStep = { ...step };
		updatedStep.settings[name] = value;
		setStep(updatedStep);
	};

	const handleOperatorChange = (name: string, value: any) => {
		const updatedStep = { ...step };
		updatedStep.settings.operator[name] = value;
		setStep(updatedStep);
	};

	return (
		<>
			<Select
				label="Select Storage to Get Data From"
				value={String(inputStorageId)}
				data={bot?.storages?.variables?.map(({ id, name }: any) => ({
					label: name,
					value: String(id),
				}))}
				onChange={(inputStorageId) =>
					handleChange('inputStorageId', Number(inputStorageId))
				}
				allowDeselect={false}
				mt="xl"
				mb="md"
			/>

			<Select
				label="Select Operator"
				value={operator.type}
				data={[{ value: 'replace', label: 'Replace Text' }]}
				onChange={(type) => handleOperatorChange('type', type)}
				allowDeselect={false}
				mb="xs"
			/>

			{operator.type === 'replace' && (
				<Flex gap="md" mb="md">
					<TextInput
						label="Enter Text to be Replaced"
						value={operator.pattern}
						onChange={(e) =>
							handleOperatorChange('pattern', e.target.value)
						}
						labelProps={{
							style: { marginBottom: '0.25rem' },
						}}
						w="100%"
					/>

					<TextInput
						label="Enter Replacement Text"
						value={operator.replacement}
						onChange={(e) =>
							handleOperatorChange('replacement', e.target.value)
						}
						labelProps={{
							style: { marginBottom: '0.25rem' },
						}}
						w="100%"
					/>
				</Flex>
			)}

			<Select
				label="Select Storage to Save the Result"
				value={String(storageId)}
				data={bot?.storages?.variables?.map(({ id, name }: any) => ({
					label: name,
					value: String(id),
				}))}
				onChange={(storageId) =>
					handleChange('storageId', Number(storageId))
				}
				allowDeselect={false}
				mb="md"
			/>
		</>
	);
};

export default DataOps;
