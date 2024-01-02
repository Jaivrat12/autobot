import { useEffect, useState } from 'react';
import { Button, MantineProvider } from '@mantine/core';
import getCssSelector from 'css-selector-generator';
import getXPath from 'get-xpath';
import ElementHighlighter from './ElementHighlighter';

// TODO: https://www.npmjs.com/package/css-selector-generator
// ? https://github.com/AutomaApp/automa/blob/main/src/content/elementSelector/listSelector.js
// ? https://github.com/AutomaApp/automa/blob/main/src/lib/findSelector.js
const ElementSelector = ({ multiple, sendResponse }) => {

    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const hoveredElement = elements[0];

    console.log('single element selector');

    const removeOverlayElements = (elements) => {
        const index = elements.findIndex(({ localName }) => localName === 'autobot-ext');
        return elements.slice(index + 1);
    };

    const highlightElement = (e) => {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        setElements(removeOverlayElements(elements));
    };

    const selectElement = (e) => {
        setSelectedElement(hoveredElement);
    };

    const confirmElement = (e) => {

        if (!selectedElement) return;

        document.removeEventListener('mousemove', highlightElement, {
            passive: true
        });
        sendResponse({
            success: true,
            XPath: getXPath(selectedElement),
            cssSelector: getCssSelector(selectedElement, {
                blacklist: ['[data-*]']
            }),
        });
    };

    useEffect(() => {

        document.addEventListener('mousemove', highlightElement, {
            passive: true
        });

        return () => {
            document.removeEventListener('mousemove', highlightElement, {
                passive: true
            });
        }
    }, []);

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
                <Button
                    onClick={confirmElement}
                    disabled={!selectedElement}
                >
                    Confirm
                </Button>
            </div>

            <div
                id="autobot-element-selector-overlay"
                onClick={selectElement}
                style={{
                    zIndex: 9999999,
                    position: 'fixed',
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: '100%',
                    background: '#0005',
                }}
            >
                <svg
                    id="autobot-element-selector-rect"
                    width="100%"
                    height="100%"
                >
                    {hoveredElement && (
                        <ElementHighlighter
                            element={hoveredElement}
                            color="#fff"
                            bgColor="#a1f3"
                            borderColor="#a1f"
                        />
                    )}

                    {selectedElement && (
                        <ElementHighlighter
                            element={selectedElement}
                            color="#fff"
                            bgColor="#ff117233"
                            borderColor="#ff1172"
                        />
                    )}
                </svg>
            </div>
        </MantineProvider>
    );
}

export default ElementSelector;