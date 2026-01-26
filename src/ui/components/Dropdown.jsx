import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown Component
 * 
 * Dropdown menu triggered by a button or custom trigger.
 * 
 * @example
 * <Dropdown
 *   trigger={<Button>Actions</Button>}
 *   items={[
 *     { label: 'Edit', onClick: handleEdit },
 *     { label: 'Delete', onClick: handleDelete, variant: 'danger' },
 *     { type: 'divider' },
 *     { label: 'Export', onClick: handleExport }
 *   ]}
 * />
 */
export function Dropdown({
    trigger,
    items = [],
    position = 'bottom-start',
    className = '',
    ...props
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on escape
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }
        if (!item.keepOpen) {
            setIsOpen(false);
        }
    };

    return (
        <div ref={dropdownRef} className={`ui-dropdown ${className}`} {...props}>
            <div className="ui-dropdown__trigger" onClick={() => setIsOpen(!isOpen)}>
                {trigger}
            </div>

            {isOpen && (
                <div className={`ui-dropdown__menu ui-dropdown__menu--${position}`}>
                    {items.map((item, index) => {
                        if (item.type === 'divider') {
                            return <div key={index} className="ui-dropdown__divider" />;
                        }

                        if (item.type === 'header') {
                            return (
                                <div key={index} className="ui-dropdown__header">
                                    {item.label}
                                </div>
                            );
                        }

                        return (
                            <button
                                key={index}
                                type="button"
                                className={`ui-dropdown__item ${item.variant ? `ui-dropdown__item--${item.variant}` : ''} ${item.disabled ? 'ui-dropdown__item--disabled' : ''}`}
                                onClick={() => handleItemClick(item)}
                                disabled={item.disabled}
                            >
                                {item.icon && <span className="ui-dropdown__item-icon">{item.icon}</span>}
                                <span className="ui-dropdown__item-label">{item.label}</span>
                                {item.shortcut && <span className="ui-dropdown__item-shortcut">{item.shortcut}</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
