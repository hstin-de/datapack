import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Card Component
 * 
 * A container with optional title, collapse functionality, and actions.
 * 
 * @example
 * <Card title="Settings" collapsible actions={<Button size="sm">Reset</Button>}>
 *   <FormField ... />
 * </Card>
 */
export function Card({
    children,
    title,
    subtitle,
    collapsible = false,
    defaultOpen = true,
    actions,
    noPadding = false,
    className = '',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const classes = [
        'ui-card',
        noPadding && 'ui-card--no-padding',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {(title || actions) && (
                <div className="ui-card__header">
                    {collapsible ? (
                        <button
                            type="button"
                            className="ui-card__toggle"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-expanded={isOpen}
                        >
                            <span className="ui-card__toggle-icon">
                                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                            <span className="ui-card__title">{title}</span>
                            {subtitle && <span className="ui-card__subtitle">{subtitle}</span>}
                        </button>
                    ) : (
                        <div className="ui-card__title-row">
                            <span className="ui-card__title">{title}</span>
                            {subtitle && <span className="ui-card__subtitle">{subtitle}</span>}
                        </div>
                    )}
                    {actions && <div className="ui-card__actions">{actions}</div>}
                </div>
            )}
            {(!collapsible || isOpen) && (
                <div className="ui-card__content">
                    {children}
                </div>
            )}
        </div>
    );
}

/**
 * Panel Component
 * 
 * A simpler container without header styling, used for grouping content.
 */
export function Panel({
    children,
    className = '',
    ...props
}) {
    return (
        <div className={`ui-panel ${className}`} {...props}>
            {children}
        </div>
    );
}
