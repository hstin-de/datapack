import React, { useState, useEffect } from 'react';

/**
 * ColorPicker Component
 * 
 * Color input with hex value display. Supports optional (nullable) colors.
 * Extracted from Biomes.jsx ColorPicker pattern.
 * 
 * @example
 * <ColorPicker value={0x4287f5} onChange={setColor} />
 * <ColorPicker value={color} onChange={setColor} optional />
 */
export function ColorPicker({
    value,
    onChange,
    optional = false,
    disabled = false,
    className = '',
    ...props
}) {
    // Convert integer to hex string
    const toHex = (num) => {
        if (num == null) return optional ? '' : '#000000';
        return '#' + (num >>> 0).toString(16).padStart(6, '0');
    };

    // Convert hex string to integer
    const fromHex = (hex) => {
        if (!hex && optional) return null;
        return parseInt(hex.replace('#', ''), 16);
    };

    const [localHex, setLocalHex] = useState(toHex(value));

    // Sync local state when external value changes
    useEffect(() => {
        setLocalHex(toHex(value));
    }, [value]);

    const handleColorChange = (hex) => {
        setLocalHex(hex);
        onChange(fromHex(hex));
    };

    const handleTextChange = (text) => {
        setLocalHex(text);
        if (/^#[0-9a-fA-F]{6}$/.test(text)) {
            onChange(fromHex(text));
        }
    };

    const handleToggle = (checked) => {
        onChange(checked ? 0x000000 : null);
    };

    const isEnabled = !optional || value != null;

    return (
        <div className={`ui-color-picker ${disabled ? 'ui-color-picker--disabled' : ''} ${className}`} {...props}>
            <input
                type="color"
                value={localHex || '#000000'}
                onChange={(e) => handleColorChange(e.target.value)}
                disabled={disabled || !isEnabled}
                className="ui-color-picker__swatch"
            />
            <input
                type="text"
                value={localHex}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="#RRGGBB"
                spellCheck={false}
                disabled={disabled || !isEnabled}
                className="ui-color-picker__input"
            />
            {optional && (
                <input
                    type="checkbox"
                    checked={value != null}
                    onChange={(e) => handleToggle(e.target.checked)}
                    disabled={disabled}
                    title="Enable/Disable"
                    className="ui-color-picker__toggle"
                />
            )}
        </div>
    );
}
