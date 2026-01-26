import React from 'react';

/**
 * EmptyState Component
 * 
 * Placeholder for empty content areas.
 * 
 * @example
 * <EmptyState 
 *   icon={<FileQuestion size={32} />}
 *   title="No items found"
 *   description="Create your first item to get started"
 *   action={<Button onClick={onCreate}>Create Item</Button>}
 * />
 */
export function EmptyState({
    icon,
    title,
    description,
    action,
    className = '',
    ...props
}) {
    return (
        <div className={`ui-empty-state ${className}`} {...props}>
            {icon && <div className="ui-empty-state__icon">{icon}</div>}
            {title && <h3 className="ui-empty-state__title">{title}</h3>}
            {description && <p className="ui-empty-state__description">{description}</p>}
            {action && <div className="ui-empty-state__action">{action}</div>}
        </div>
    );
}
