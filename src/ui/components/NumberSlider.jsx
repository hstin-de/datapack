import React from 'react';

/**
 * NumberSlider Component
 * 
 * Number input with slider for visual adjustment.
 * 
 * @example
 * <NumberSlider value={0.5} min={0} max={1} step={0.1} onChange={setValue} />
 */
export function NumberSlider({
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    showInput = true,
    disabled = false,
    className = '',
    ...props
}) {
    const handleChange = (newValue) => {
        const parsed = parseFloat(newValue);
        if (!isNaN(parsed)) {
            onChange(Math.min(max, Math.max(min, parsed)));
        }
    };

    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`ui-number-slider ${disabled ? 'ui-number-slider--disabled' : ''} ${className}`} {...props}>
            <div className="ui-number-slider__track-wrapper">
                <input
                    type="range"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className="ui-number-slider__range"
                    style={{ '--slider-percentage': `${percentage}%` }}
                />
            </div>
            {showInput && (
                <input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    min={min}
                    max={max}
                    step={step}
                    disabled={disabled}
                    className="ui-number-slider__input"
                />
            )}
        </div>
    );
}
