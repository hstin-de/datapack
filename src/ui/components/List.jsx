import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * List Component
 * 
 * Renders a list of items with selection support.
 * 
 * @example
 * <List 
 *   items={biomes}
 *   renderItem={(biome) => biome.name}
 *   selectedIndex={selectedBiome}
 *   onSelect={setSelectedBiome}
 *   emptyState="No biomes created yet"
 * />
 */
export function List({
    items = [],
    renderItem,
    selectedIndex,
    onSelect,
    onRemove,
    emptyState = 'No items',
    className = '',
    ...props
}) {
    if (items.length === 0) {
        return (
            <div className={`ui-list ui-list--empty ${className}`} {...props}>
                <span className="ui-list__empty">{emptyState}</span>
            </div>
        );
    }

    return (
        <div className={`ui-list ${className}`} role="listbox" {...props}>
            {items.map((item, index) => (
                <ListItem
                    key={index}
                    selected={index === selectedIndex}
                    onClick={() => onSelect?.(index)}
                    onRemove={onRemove && items.length > 1 ? () => onRemove(index) : undefined}
                >
                    {renderItem ? renderItem(item, index) : String(item)}
                </ListItem>
            ))}
        </div>
    );
}

/**
 * ListItem Component
 * 
 * Individual selectable/deletable list item.
 * 
 * @example
 * <ListItem selected onClick={handleClick} onRemove={handleRemove}>
 *   Item content
 * </ListItem>
 */
export function ListItem({
    children,
    selected = false,
    onClick,
    onRemove,
    className = '',
    ...props
}) {
    return (
        <div
            className={`ui-list-item ${selected ? 'ui-list-item--selected' : ''} ${className}`}
            onClick={onClick}
            role="option"
            aria-selected={selected}
            {...props}
        >
            <span className="ui-list-item__content">{children}</span>
            {onRemove && (
                <button
                    type="button"
                    className="ui-list-item__remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    aria-label="Remove"
                >
                    <Trash2 size={12} />
                </button>
            )}
        </div>
    );
}
