import { Anchor, Text } from '@mantine/core';
import { SelectorDataTypes } from '~enums';

const DisplayData = ({ storageName, storageType, data, metadata }) => {

    return (

        <table
            border="1px solid"
            cellSpacing="0"
            width="100%"
            style={{ textAlign: 'center' }}
        >
            {storageType !== 'table' ? (
                <>
                    <thead>
                        <tr>
                            <th style={{ padding: '0.25rem' }}>
                                <Text>
                                    {storageName}
                                </Text>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data?.map((item, i) => (
                            <tr key={i}>
                                <td
                                    style={{
                                        padding: '0.25rem',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {metadata.type === SelectorDataTypes.Text && (
                                        <Text>
                                            {item}
                                        </Text>
                                    )}
                                    {metadata.type === SelectorDataTypes.Link && (
                                        <Anchor
                                            href={item}
                                            target="_blank"
                                            underline="hover"
                                        >
                                            {item}
                                        </Anchor>
                                    )}
                                    {metadata.type === SelectorDataTypes.Image && (
                                        <img
                                            src={item}
                                            style={{
                                                padding: '0.5rem',
                                                maxWidth: '100px',
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </>
            ) : (
                <>
                    <thead>
                        <tr>
                            {metadata.map((column) => (
                                <th
                                    key={column.columnName}
                                    style={{ padding: '0.25rem' }}
                                >
                                    <Text>
                                        {column.columnName}
                                    </Text>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {data?.map((row, i) => (
                            <tr key={i}>
                                {metadata.map((column, j) => (
                                    <td
                                        key={`${i},${j}`}
                                        style={{ padding: '0.25rem' }}
                                    >
                                        {column.type === SelectorDataTypes.Text && (
                                            <Text>
                                                {row[j]}
                                            </Text>
                                        )}
                                        {column.type === SelectorDataTypes.Link && (
                                            <Anchor
                                                href={row[j]}
                                                target="_blank"
                                                underline="hover"
                                            >
                                                {row[j]}
                                            </Anchor>
                                        )}
                                        {column.type === SelectorDataTypes.Image && (
                                            <img
                                                src={row[j]}
                                                style={{
                                                    padding: '0.25rem',
                                                    maxWidth: '100px',
                                                }}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </>
            )}
        </table>
    );
}

export default DisplayData;