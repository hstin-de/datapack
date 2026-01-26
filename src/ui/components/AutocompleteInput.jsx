import React, { useState, useRef, useEffect, forwardRef } from 'react';

/**
 * AutocompleteInput Component
 * 
 * Input with dropdown suggestions and validation support.
 * Migrated from SmartInput with UI framework patterns.
 * 
 * @example
 * <AutocompleteInput 
 *   value={biomeId}
 *   onChange={setBiomeId}
 *   suggestions={['minecraft:plains', 'minecraft:forest']}
 *   placeholder="minecraft:..."
 *   validator={(v) => v.includes(':') ? null : 'Must include namespace'}
 * />
 */
export const AutocompleteInput = forwardRef(function AutocompleteInput({
    value = '',
    onChange,
    suggestions = [],
    placeholder,
    validator,
    disabled = false,
    maxSuggestions = 50,
    className = '',
    ...props
}, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Combine refs
    const setRef = (el) => {
        inputRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
    };

    // Filter suggestions based on current value
    const filteredSuggestions = suggestions
        .filter(s => s.toLowerCase().includes((value || '').toLowerCase()))
        .slice(0, maxSuggestions);

    // Validate current value
    const error = validator ? validator(value) : null;

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!isOpen || filteredSuggestions.length === 0) {
            if (e.key === 'ArrowDown' && filteredSuggestions.length > 0) {
                setIsOpen(true);
                setHighlightedIndex(0);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(i =>
                    i < filteredSuggestions.length - 1 ? i + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(i =>
                    i > 0 ? i - 1 : filteredSuggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < filteredSuggestions.length) {
                    selectSuggestion(filteredSuggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    const selectSuggestion = (suggestion) => {
        onChange(suggestion);
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.focus();
    };

    const handleInputChange = (e) => {
        onChange(e.target.value);
        setIsOpen(true);
        setHighlightedIndex(-1);
    };

    const classes = [
        'ui-autocomplete',
        isOpen && filteredSuggestions.length > 0 && 'ui-autocomplete--open',
        error && 'ui-autocomplete--error',
        disabled && 'ui-autocomplete--disabled',
        className
    ].filter(Boolean).join(' ');

    return (
        <div ref={wrapperRef} className={classes}>
            <input
                ref={setRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className="ui-autocomplete__input"
                autoComplete="off"
                {...props}
            />

            {isOpen && filteredSuggestions.length > 0 && (
                <ul className="ui-autocomplete__dropdown" role="listbox">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={suggestion}
                            role="option"
                            aria-selected={index === highlightedIndex}
                            className={`ui-autocomplete__option ${index === highlightedIndex ? 'ui-autocomplete__option--highlighted' : ''}`}
                            onClick={() => selectSuggestion(suggestion)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}

            {error && <span className="ui-autocomplete__error">{error}</span>}
        </div>
    );
});
