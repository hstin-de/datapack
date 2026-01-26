import React from 'react';

/**
 * Divider Component
 * 
 * Horizontal or vertical divider line with optional label.
 * 
 * @example
 * <Divider />
 * <Divider label="OR" />
 * <Divider orientation="vertical" />
 */
export function Divider({
    label,
    orientation = 'horizontal',
    className = '',
    ...props
}) {
    if (label) {
        return (
            <div className={`ui-divider ui-divider--labeled ${className}`} {...props}>
                <span className="ui-divider__line" />
                <span className="ui-divider__label">{label}</span>
                <span className="ui-divider__line" />
            </div>
        );
    }

    return (
        <hr
            className={`ui-divider ui-divider--${orientation} ${className}`}
            {...props}
        />
    );
}

/**
 * Spacer Component
 * 
 * Flexible space that grows to fill available space.
 * Useful in flex containers to push items apart.
 * 
 * @example
 * <HStack>
 *   <Logo />
 *   <Spacer />
 *   <Button>Login</Button>
 * </HStack>
 */
export function Spacer({ size, className = '', ...props }) {
    const style = size
        ? { flexGrow: 0, flexShrink: 0, width: typeof size === 'number' ? `var(--ui-space-${size})` : size, height: typeof size === 'number' ? `var(--ui-space-${size})` : size }
        : { flex: 1 };

    return <div className={`ui-spacer ${className}`} style={style} {...props} />;
}
