import React from 'react';

/**
 * Badge Component
 * 
 * @example
 * <Badge>Default</Badge>
 * <Badge variant="success">Active</Badge>
 * <Badge variant="warning">Pending</Badge>
 * <Badge variant="error">Failed</Badge>
 */
export function Badge({
    children,
    variant = 'default',
    size = 'md',
    className = '',
    ...props
}) {
    const classes = [
        'ui-badge',
        `ui-badge--${variant}`,
        `ui-badge--${size}`,
        className
    ].filter(Boolean).join(' ');

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
}

/**
 * Tag Component (removable Badge)
 * 
 * @example
 * <Tag onRemove={() => removeTag(id)}>minecraft:stone</Tag>
 */
export function Tag({
    children,
    onRemove,
    variant = 'default',
    className = '',
    ...props
}) {
    return (
        <span className={`ui-tag ui-tag--${variant} ${className}`} {...props}>
            <span className="ui-tag__content">{children}</span>
            {onRemove && (
                <button
                    type="button"
                    className="ui-tag__remove"
                    onClick={onRemove}
                    aria-label="Remove"
                >
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                    </svg>
                </button>
            )}
        </span>
    );
}
