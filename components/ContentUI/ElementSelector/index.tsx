import { useState, type MouseEventHandler } from 'react';
import { MantineProvider } from '@mantine/core';
import ElementHighlighter from './ElementHighlighter';
import ElementSelectorModal from './ElementSelectorModal';
import getCssSelector from 'css-selector-generator';
import getXPath from 'get-xpath';

type ElementSelectorProps = {
    multiple: boolean;
    sendResponse: any;
};

// TODO: https://www.npmjs.com/package/css-selector-generator
// ? https://github.com/AutomaApp/automa/blob/main/src/content/elementSelector/listSelector.js
// ? https://github.com/AutomaApp/automa/blob/main/src/lib/findSelector.js
const ElementSelector = ({ multiple, sendResponse }: ElementSelectorProps) => {

    const [showOverlay, setShowOverlay] = useState(true);
    const toggleShowOverlay = () => setShowOverlay(val => !val);

    const [elements, setElements] = useState<Element[]>([]);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const hoveredElement = elements[0];

    const hoveredSiblings = [...hoveredElement?.parentElement?.children ?? []];
    const selectedSiblings = [...selectedElement?.parentElement?.children ?? []];

    const [hoveredChildren, setHoveredChildren] = useState<(Element | null)[]>([]);
    const [selectedChildren, setSelectedChildren] = useState<(Element | null)[]>([]);

    const hoveringChild = hoveredChildren.includes(hoveredElement);

    const removeOverlayElements = (elements: Element[]) => {
        const index = elements.findIndex(({ localName }) => localName === 'autobot-ext');
        return elements.slice(index + 1);
    };

    const highlightElement: MouseEventHandler<HTMLDivElement> = (e) => {

        const getListElement = (element: Element | null): Element | null => {

            if (!element) {
                return null;
            }

            if (element.localName === 'li') {
                return element;
            }

            return getListElement(element.parentElement);
        };

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

    const selectElement: MouseEventHandler<HTMLDivElement> = (e) => {
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

    return (

        <MantineProvider>
            {showOverlay && (
                <div
                    id="autobot-element-selector-overlay"
                    onClick={selectElement}
                    onMouseMove={highlightElement}
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

            <ElementSelectorModal
                selectedElement={selectedElement}
                confirm={confirmElement}
                cancel={() => sendResponse({ success: false })}
                showOverlay={showOverlay}
                toggleShowOverlay={toggleShowOverlay}
            />
        </MantineProvider>
    );
}

export default ElementSelector;