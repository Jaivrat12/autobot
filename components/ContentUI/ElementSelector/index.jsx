import { useEffect, useState } from 'react';
import { Button, MantineProvider } from '@mantine/core';
import ElementHighlighter from './ElementHighlighter';
import getCssSelector from 'css-selector-generator';
import getXPath from 'get-xpath';
import { getKeysCombo } from '~utils/helper';

// TODO: https://www.npmjs.com/package/css-selector-generator
// ? https://github.com/AutomaApp/automa/blob/main/src/content/elementSelector/listSelector.js
// ? https://github.com/AutomaApp/automa/blob/main/src/lib/findSelector.js
const ElementSelector = ({ multiple, sendResponse }) => {

    const [showOverlay, setShowOverlay] = useState(true);

    const [elements, setElements] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);
    const hoveredElement = elements[0];

    const hoveredSiblings = [...hoveredElement?.parentElement?.children ?? []];
    const selectedSiblings = [...selectedElement?.parentElement?.children ?? []];

    const [hoveredChildren, setHoveredChildren] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);

    const hoveringChild = hoveredChildren.includes(hoveredElement);

    const removeOverlayElements = (elements) => {
        const index = elements.findIndex(({ localName }) => localName === 'autobot-ext');
        return elements.slice(index + 1);
    };

    const highlightElement = (e) => {

        const getListElement = (element) => {

            if (!element) {
                return null;
            }

            if (element.localName === 'li') {
                return element;
            }

            return getListElement(element.parentElement);
        }

        let elements = removeOverlayElements(
            document.elementsFromPoint(e.clientX, e.clientY)
        );

        if (!multiple || selectedSiblings.length === 0) {
            if (multiple) {
                const listElement = getListElement(elements[0]);
                elements = listElement ? [listElement] : elements;
            }
            setElements(elements);
        } else {

            const [child] = elements;
            for (const sibling of selectedSiblings) {

                if (sibling.contains(child)) {
                    const cssSelector = getCssSelector(child, { root: sibling });
                    const children = selectedSiblings.map((parent) => parent.querySelector(cssSelector));
                    setHoveredChildren(children);
                    return;
                }
            }
            setElements(elements);
        }
    };

    const selectElement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hoveredChildren.length) {
            setSelectedChildren(hoveredChildren);
        } else {
            setSelectedElement(hoveredElement);
        }
    };

    const confirmElement = () => {

        if (!selectedElement) return;

        document.removeEventListener('mousemove', highlightElement, {
            passive: true
        });

        const elements = multiple ?
            selectedChildren.length
                ? selectedChildren
                : selectedSiblings
            : selectedElement;

        sendResponse({
            success: true,
            XPath: getXPath(selectedElement),
            cssSelector: getCssSelector(elements, {
                selectors: ['id', 'class', 'tag'],
                // ! prefer whitelist
                blacklist: ['[data-*]'],
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
    }, [elements, selectedElement]);

    useEffect(() => {
        const listenToKeyCombos = (e) => {
            e.preventDefault();
            const keyCombo = getKeysCombo(e);
            if (keyCombo === 'Ctrl+H') {
                setShowOverlay(val => !val);
            } else if (keyCombo === 'Ctrl+ENTER') {
                confirmElement();
            }
        };
        document.addEventListener('keydown', listenToKeyCombos);
        return () => document.removeEventListener('keydown', listenToKeyCombos);
    }, [elements, selectedElement]);

    return (

        <MantineProvider>
            {/* <div
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
            </div> */}

            {showOverlay && (

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
                        {multiple && !hoveringChild && hoveredElement && hoveredSiblings.map((sibling, i) => (

                            <ElementHighlighter
                                key={i}
                                element={sibling}
                                color="#fff"
                                bgColor="#a1f3"
                                borderColor="#a1f"
                            />
                        ))}

                        {!multiple && hoveredElement && (

                            <ElementHighlighter
                                element={hoveredElement}
                                color="#fff"
                                bgColor="#a1f3"
                                borderColor="#a1f"
                            />
                        )}

                        {multiple && selectedElement && selectedSiblings.map((sibling, i) => (

                            <ElementHighlighter
                                key={i}
                                element={sibling}
                                color="#fff"
                                bgColor="#ff117233"
                                borderColor="#ff1172"
                            />
                        ))}

                        {!multiple && selectedElement && (

                            <ElementHighlighter
                                element={selectedElement}
                                color="#fff"
                                bgColor="#ff117233"
                                borderColor="#ff1172"
                            />
                        )}

                        {multiple && hoveredChildren.map((child, i) => child && (

                            <ElementHighlighter
                                key={i}
                                element={child}
                                color="#fff"
                                bgColor="#1172ff33"
                                borderColor="#1172ff"
                            />
                        ))}

                        {multiple && selectedChildren.map((child, i) => child && (

                            <ElementHighlighter
                                key={i}
                                element={child}
                                color="#fff"
                                bgColor="#11ffff33"
                                borderColor="#11ffff"
                            />
                        ))}
                    </svg>
                </div>
            )}
        </MantineProvider>
    );
}

export default ElementSelector;