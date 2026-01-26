import React from 'react';

/**
 * Icon Wrapper Component
 * 
 * Standardizes icon sizing and styling for consistency.
 * Works with lucide-react icons.
 * 
 * @example
 * import { Save } from 'lucide-react';
 * <Icon icon={Save} size="md" />
 * <Icon icon={Save} size="lg" color="var(--ui-primary)" />
 */
export function Icon({
    icon: IconComponent,
    size = 'md',
    color,
    className = '',
    ...props
}) {
    const sizeMap = {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 20,
        '2xl': 24,
    };

    const pixelSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.md;

    return (
        <span
            className={`ui-icon ui-icon--${size} ${className}`}
            style={{ color }}
            {...props}
        >
            <IconComponent size={pixelSize} />
        </span>
    );
}
