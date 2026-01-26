import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * TagInput Component
 * 
 * Multi-value input for managing lists of strings.
 * Based on StringListEditor pattern from Biomes.jsx.
 * 
 * @example
 * <TagInput 
 *   values={['minecraft:stone', 'minecraft:dirt']}
 *   onChange={setValues}
 *   suggestions={allBlockIds}
 *   placeholder="Add block..."
 * />
 */
export function TagInput({
    values = [],
    onChange,
    suggestions = [],
    placeholder = 'Add item...',
    validator,
    disabled = false,
    className = '',
    ...props
}) {
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    const error = input ? (validator ? validator(input) : null) : null;
    const canAdd = input && !error && !values.includes(input);

    // Filter suggestions based on input
    const filteredSuggestions = suggestions
        .filter(s =>
            s.toLowerCase().includes(input.toLowerCase()) &&
            !values.includes(s)
        )
        .slice(0, 50);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addValue = (val) => {
        if (val && !values.includes(val) && (!validator || !validator(val))) {
            onChange([...values, val]);
            setInput('');
            setIsOpen(false);
        }
    };

    const removeValue = (index) => {
        onChange(values.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && canAdd) {
            e.preventDefault();
            addValue(input);
        }
        if (e.key === 'Backspace' && !input && values.length > 0) {
            removeValue(values.length - 1);
        }
    };

    return (
        <div
            ref={wrapperRef}
            className={`ui-tag-input ${disabled ? 'ui-tag-input--disabled' : ''} ${className}`}
            {...props}
        >
            {/* Tags */}
            <div className="ui-tag-input__tags">
                {values.map((val, i) => (
                    <span key={i} className="ui-tag-input__tag">
                        <span className="ui-tag-input__tag-text">{val}</span>
                        {!disabled && (
                            <button
                                type="button"
                                className="ui-tag-input__tag-remove"
                                onClick={() => removeValue(i)}
                                aria-label="Remove"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </span>
                ))}
            </div>

            {/* Input row */}
            <div className="ui-tag-input__input-row">
                <div className="ui-tag-input__input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder={values.length === 0 ? placeholder : ''}
                        disabled={disabled}
                        className="ui-tag-input__input"
                    />

                    {/* Suggestions dropdown */}
                    {isOpen && filteredSuggestions.length > 0 && (
                        <ul className="ui-tag-input__suggestions">
                            {filteredSuggestions.map((s) => (
                                <li
                                    key={s}
                                    onClick={() => addValue(s)}
                                    className="ui-tag-input__suggestion"
                                >
                                    {s}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => canAdd && addValue(input)}
                    disabled={!canAdd || disabled}
                    className="ui-tag-input__add-btn"
                >
                    Add
                </button>
            </div>

            {error && <span className="ui-tag-input__error">{error}</span>}
        </div>
    );
}
