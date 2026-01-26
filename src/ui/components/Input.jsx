import React, { forwardRef } from 'react';

/**
 * Input Component
 * 
 * @example
 * <Input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
 * <Input type="number" min={0} max={100} />
 * <Input error="This field is required" />
 * <Input prefix={<Search size={14} />} />
 */
export const Input = forwardRef(function Input({
    type = 'text',
    size = 'md',
    error,
    prefix,
    suffix,
    className = '',
    ...props
}, ref) {
    const wrapperClasses = [
        'ui-input-wrapper',
        `ui-input-wrapper--${size}`,
        error && 'ui-input-wrapper--error',
        prefix && 'ui-input-wrapper--has-prefix',
        suffix && 'ui-input-wrapper--has-suffix',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={wrapperClasses}>
            {prefix && <span className="ui-input__prefix">{prefix}</span>}
            <input
                ref={ref}
                type={type}
                className="ui-input"
                {...props}
            />
            {suffix && <span className="ui-input__suffix">{suffix}</span>}
        </div>
    );
});

/**
 * TextArea Component
 * 
 * @example
 * <TextArea value={text} onChange={e => setText(e.target.value)} rows={4} />
 */
export const TextArea = forwardRef(function TextArea({
    size = 'md',
    error,
    className = '',
    ...props
}, ref) {
    const classes = [
        'ui-textarea',
        `ui-textarea--${size}`,
        error && 'ui-textarea--error',
        className
    ].filter(Boolean).join(' ');

    return (
        <textarea
            ref={ref}
            className={classes}
            {...props}
        />
    );
});

/**
 * Select Component
 * 
 * @example
 * <Select value={value} onChange={e => setValue(e.target.value)} options={[
 *   { value: 'a', label: 'Option A' },
 *   { value: 'b', label: 'Option B' }
 * ]} />
 */
export const Select = forwardRef(function Select({
    options = [],
    placeholder,
    size = 'md',
    error,
    className = '',
    children,
    ...props
}, ref) {
    const classes = [
        'ui-select',
        `ui-select--${size}`,
        error && 'ui-select--error',
        className
    ].filter(Boolean).join(' ');

    return (
        <select ref={ref} className={classes} {...props}>
            {placeholder && (
                <option value="" disabled>
                    {placeholder}
                </option>
            )}
            {options.length > 0
                ? options.map((opt) => {
                    const isGroup = opt.options != null;
                    if (isGroup) {
                        return (
                            <optgroup key={opt.label} label={opt.label}>
                                {opt.options.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </optgroup>
                        );
                    }
                    return (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    );
                })
                : children}
        </select>
    );
});

/**
 * Checkbox Component
 * 
 * @example
 * <Checkbox checked={checked} onChange={e => setChecked(e.target.checked)} label="Accept terms" />
 */
export function Checkbox({
    checked,
    onChange,
    label,
    disabled = false,
    className = '',
    ...props
}) {
    return (
        <label className={`ui-checkbox ${disabled ? 'ui-checkbox--disabled' : ''} ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="ui-checkbox__input"
                {...props}
            />
            <span className="ui-checkbox__box">
                {checked && (
                    <svg viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                )}
            </span>
            {label && <span className="ui-checkbox__label">{label}</span>}
        </label>
    );
}
