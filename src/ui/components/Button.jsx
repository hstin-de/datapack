import React from 'react';

/**
 * Button Component
 * 
 * @example
 * <Button variant="primary" onClick={handleClick}>Save</Button>
 * <Button variant="secondary" icon={<Save size={14} />}>Save</Button>
 * <Button variant="ghost" size="sm" loading>Loading...</Button>
 * <Button variant="danger" disabled>Delete</Button>
 */
export function Button({
    children,
    variant = 'secondary',
    size = 'md',
    icon,
    iconOnly = false,
    loading = false,
    disabled = false,
    className = '',
    type = 'button',
    ...props
}) {
    const classes = [
        'ui-btn',
        `ui-btn--${variant}`,
        `ui-btn--${size}`,
        iconOnly && 'ui-btn--icon-only',
        loading && 'ui-btn--loading',
        disabled && 'ui-btn--disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <span className="ui-btn__spinner" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" opacity="0.25" />
                        <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                </span>
            )}
            {icon && !loading && <span className="ui-btn__icon">{icon}</span>}
            {!iconOnly && children && <span className="ui-btn__label">{children}</span>}
        </button>
    );
}

/**
 * IconButton - Button with only an icon
 */
export function IconButton({ icon, label, ...props }) {
    return (
        <Button iconOnly aria-label={label} title={label} icon={icon} {...props} />
    );
}
