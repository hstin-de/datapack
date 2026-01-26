import React, { useMemo } from 'react';
import { AutocompleteInput } from '../ui';
import { createFieldValidator, validateResourceLocation } from '../utils/validation.js';
import { getRegistrySuggestions } from '../utils/vanilla-registry.js';

export function ResourceLocationInput({
  value = '',
  onChange,
  registry,
  allowTags = false,
  placeholder = 'minecraft:...',
  disabled = false,
  className = '',
  ...props
}) {
  const validator = useMemo(
    () => createFieldValidator(validateResourceLocation, { allowTags, registry }),
    [allowTags, registry]
  );

  const suggestions = useMemo(() => {
    if (!registry) return [];
    return getRegistrySuggestions(registry, value || '');
  }, [registry, value]);

  return (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      suggestions={suggestions}
      placeholder={placeholder}
      validator={validator}
      disabled={disabled}
      className={className}
      {...props}
    />
  );
}
