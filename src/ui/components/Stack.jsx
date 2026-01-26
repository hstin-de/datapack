import React from 'react';

/**
 * Stack Component
 * 
 * Flexbox layout with configurable direction, gap, and alignment.
 * 
 * @example
 * <Stack gap={2}>
 *   <Button>One</Button>
 *   <Button>Two</Button>
 * </Stack>
 * 
 * <Stack direction="horizontal" gap={4} align="center">
 *   <Icon icon={Save} />
 *   <span>Save Changes</span>
 * </Stack>
 */
export function Stack({
    children,
    direction = 'vertical',
    gap = 2,
    align,
    justify,
    wrap = false,
    className = '',
    style = {},
    ...props
}) {
    const gapValue = typeof gap === 'number' ? `var(--ui-space-${gap})` : gap;

    const alignMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        stretch: 'stretch',
        baseline: 'baseline',
    };

    const justifyMap = {
        start: 'flex-start',
        center: 'center',
        end: 'flex-end',
        between: 'space-between',
        around: 'space-around',
        evenly: 'space-evenly',
    };

    const stackStyle = {
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap: gapValue,
        alignItems: align ? alignMap[align] : undefined,
        justifyContent: justify ? justifyMap[justify] : undefined,
        flexWrap: wrap ? 'wrap' : undefined,
        ...style,
    };

    return (
        <div className={`ui-stack ${className}`} style={stackStyle} {...props}>
            {children}
        </div>
    );
}

/**
 * HStack - Horizontal Stack shorthand
 */
export function HStack({ children, ...props }) {
    return (
        <Stack direction="horizontal" {...props}>
            {children}
        </Stack>
    );
}

/**
 * VStack - Vertical Stack shorthand
 */
export function VStack({ children, ...props }) {
    return (
        <Stack direction="vertical" {...props}>
            {children}
        </Stack>
    );
}
