import React, { useState, useEffect, forwardRef } from 'react';

/**
 * JsonEditor Component
 * 
 * Textarea for editing JSON with syntax error handling.
 * Syncs on blur to avoid performance issues during typing.
 * 
 * @example
 * <JsonEditor 
 *   value={config}
 *   onChange={setConfig}
 *   label="Configuration"
 * />
 */
export const JsonEditor = forwardRef(function JsonEditor({
    value,
    onChange,
    label,
    minHeight = '300px',
    disabled = false,
    className = '',
    ...props
}, ref) {
    // Local string state for editing
    const [text, setText] = useState(() =>
        typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    );
    const [error, setError] = useState(null);

    // Sync when external value changes
    useEffect(() => {
        const newText = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        setText(newText);
        setError(null);
    }, [value]);

    const handleChange = (e) => {
        setText(e.target.value);
        // Clear error while typing
        if (error) setError(null);
    };

    const handleBlur = () => {
        try {
            const parsed = JSON.parse(text);
            onChange(parsed);
            setError(null);
        } catch (e) {
            setError(`Invalid JSON: ${e.message}`);
        }
    };

    const classes = [
        'ui-json-editor',
        error && 'ui-json-editor--error',
        disabled && 'ui-json-editor--disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {label && (
                <div className="ui-json-editor__header">
                    <span className="ui-json-editor__label">{label}</span>
                    {error && <span className="ui-json-editor__error-badge">Error</span>}
                </div>
            )}
            <textarea
                ref={ref}
                value={text}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
                spellCheck="false"
                className="ui-json-editor__textarea"
                style={{ minHeight }}
                {...props}
            />
            {error && (
                <div className="ui-json-editor__error">
                    {error}
                </div>
            )}
        </div>
    );
});

/**
 * MultiJsonEditor Component
 * 
 * Side-by-side JSON editors for related configs.
 * 
 * @example
 * <MultiJsonEditor
 *   editors={[
 *     { label: 'Config', value: config, onChange: setConfig },
 *     { label: 'Placement', value: placement, onChange: setPlacement }
 *   ]}
 * />
 */
export function MultiJsonEditor({
    editors = [],
    minHeight = '400px',
    className = '',
    ...props
}) {
    return (
        <div className={`ui-multi-json-editor ${className}`} {...props}>
            {editors.map((editor, i) => (
                <JsonEditor
                    key={i}
                    value={editor.value}
                    onChange={editor.onChange}
                    label={editor.label}
                    minHeight={minHeight}
                />
            ))}
        </div>
    );
}
