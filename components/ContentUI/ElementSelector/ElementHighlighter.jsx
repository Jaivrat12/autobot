import { getElementFullName } from '~utils/helper'

const ElementHighlighter = ({ element, bgColor, borderColor, color }) => {

    const box = element.getBoundingClientRect();
    const elementName = getElementFullName(element);

    return (
        <>
            <foreignObject
                x={box.x - 1}
                style={{ y: `calc(${box.y}px - 1.4rem)` }}
                width="100%"
                height="100%"
            >
                <div
                    style={{
                        background: borderColor,
                        display: 'inline-block',
                        padding: '0 0.25rem',
                        color: color,
                    }}
                >
                    {elementName}
                </div>
            </foreignObject>

            <rect
                x={box.x}
                y={box.y}
                width={box.width}
                height={box.height}
                fill={bgColor}
                stroke={borderColor}
                strokeWidth="2"
            />
        </>
    );
}

export default ElementHighlighter;