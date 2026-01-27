import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IconButton } from './Button';
import { EmptyState } from './EmptyState';

/**
 * MasterDetailLayout Component
 * 
 * Two-column layout with a selectable list on the left and detail content on the right.
 * Common pattern for editing lists of items (biomes, features, etc).
 * 
 * @example
 * <MasterDetailLayout
 *   items={features}
 *   selectedIndex={selectedIndex}
 *   onSelect={setSelectedIndex}
 *   onAdd={addFeature}
 *   onRemove={removeFeature}
 *   title="Features"
 *   renderItem={(item) => item.idPath}
 * >
 *   <FeatureEditor feature={features[selectedIndex]} />
 * </MasterDetailLayout>
 */
export function MasterDetailLayout({
    items = [],
    selectedIndex,
    onSelect,
    onAdd,
    onRemove,
    title = 'Items',
    renderItem = (item) => item.niceName || item.idPath || 'Unnamed',
    emptyMessage = 'No items',
    emptyAction = 'Click + to add',
    sidebarWidth = '220px',
    sidebarChildren,
    children,
    className = '',
    ...props
}) {
    const hasSelection = selectedIndex !== null &&
        selectedIndex >= 0 &&
        selectedIndex < items.length;

    return (
        <div className={`ui-master-detail ${className}`} {...props}>
            {/* Sidebar / Master */}
            <aside
                className="ui-master-detail__sidebar"
                style={{ '--sidebar-width': sidebarWidth }}
            >
                <header className="ui-master-detail__header">
                    <span className="ui-master-detail__title">{title}</span>
                    {onAdd && (
                        <IconButton
                            icon={<Plus size={14} />}
                            size="sm"
                            variant="ghost"
                            onClick={onAdd}
                            title="Add Item"
                        />
                    )}
                </header>

                <div className="ui-master-detail__list">
                    {items.length === 0 ? (
                        <div className="ui-master-detail__empty">
                            {emptyMessage}
                            {emptyAction && <span>{emptyAction}</span>}
                        </div>
                    ) : (
                        items.map((item, idx) => (
                            <div
                                key={idx}
                                className={`ui-master-detail__item ${idx === selectedIndex ? 'ui-master-detail__item--active' : ''}`}
                                onClick={() => onSelect(idx)}
                            >
                                <span className="ui-master-detail__item-label">
                                    {renderItem(item)}
                                </span>
                                {onRemove && (
                                    <button
                                        className="ui-master-detail__item-remove"
                                        onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                                        title="Remove"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {sidebarChildren}
            </aside>

            {/* Detail / Content */}
            <main className="ui-master-detail__content">
                {hasSelection ? (
                    children
                ) : (
                    <EmptyState
                        message="Select an item to edit"
                        className="ui-master-detail__placeholder"
                    />
                )}
            </main>
        </div>
    );
}
