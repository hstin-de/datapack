import React, { useState, useRef, useEffect } from 'react';

/**
 * Tooltip Component
 * 
 * @example
 * <Tooltip content="Save your changes">
 *   <Button>Save</Button>
 * </Tooltip>
 */
export function Tooltip({
    children,
    content,
    position = 'top',
    delay = 300,
    className = '',
}) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);
    const triggerRef = useRef(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!content) {
        return children;
    }

    return (
        <span
            className={`ui-tooltip-trigger ${className}`}
            ref={triggerRef}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && (
                <span className={`ui-tooltip ui-tooltip--${position}`} role="tooltip">
                    <span className="ui-tooltip__content">{content}</span>
                    <span className="ui-tooltip__arrow" />
                </span>
            )}
        </span>
    );
}
