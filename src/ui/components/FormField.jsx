import React from 'react';

/**
 * FormField Component
 * 
 * Wraps an input with label, help text, and error message.
 * Replaces the `.input-grid` pattern for form fields.
 * 
 * @example
 * <FormField label="Name" help="Enter your display name" error={errors.name}>
 *   <Input value={name} onChange={setName} />
 * </FormField>
 * 
 * <FormField label="Age" horizontal>
 *   <Input type="number" value={age} onChange={setAge} />
 * </FormField>
 */
export function FormField({
    children,
    label,
    help,
    error,
    required = false,
    horizontal = true,
    labelWidth = '150px',
    className = '',
    ...props
}) {
    const classes = [
        'ui-form-field',
        horizontal && 'ui-form-field--horizontal',
        error && 'ui-form-field--error',
        className
    ].filter(Boolean).join(' ');

    const style = horizontal ? { '--ui-form-field-label-width': labelWidth } : undefined;

    return (
        <div className={classes} style={style} {...props}>
            {label && (
                <label className="ui-form-field__label">
                    {label}
                    {required && <span className="ui-form-field__required">*</span>}
                </label>
            )}
            <div className="ui-form-field__content">
                <div className="ui-form-field__input">{children}</div>
                {help && !error && <span className="ui-form-field__help">{help}</span>}
                {error && <span className="ui-form-field__error">{error}</span>}
            </div>
        </div>
    );
}

/**
 * FormGroup Component
 * 
 * Groups related form fields with a title.
 * Replaces `.section-group` + `.section-title` pattern.
 * 
 * @example
 * <FormGroup title="Identity">
 *   <FormField label="Name">...</FormField>
 *   <FormField label="ID Path">...</FormField>
 * </FormGroup>
 */
export function FormGroup({
    children,
    title,
    description,
    className = '',
    ...props
}) {
    return (
        <div className={`ui-form-group ${className}`} {...props}>
            {title && (
                <div className="ui-form-group__header">
                    <h3 className="ui-form-group__title">{title}</h3>
                    {description && <p className="ui-form-group__description">{description}</p>}
                </div>
            )}
            <div className="ui-form-group__content">{children}</div>
        </div>
    );
}
