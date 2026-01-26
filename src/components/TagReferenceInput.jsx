import React, { useMemo } from 'react';
import { AutocompleteInput } from '../ui';
import { validateResourceLocation, createFieldValidator } from '../utils/validation.js';
import { getRegistrySuggestions } from '../utils/vanilla-registry.js';

export function TagReferenceInput({
  value = '',
  onChange,
  registry,
  placeholder = '#minecraft:tag',
  disabled = false,
  className = '',
  ...props
}) {
  const suggestions = useMemo(() => {
    if (!registry) return [];
    return getRegistrySuggestions(registry, value || '');
  }, [registry, value]);

  const validator = useMemo(() => {
    const baseValidator = createFieldValidator(validateResourceLocation, { allowTags: true, registry });
    return (val) => {
      const baseError = baseValidator(val);
      if (baseError) return baseError;
      if (val && !val.startsWith('#')) return 'Tag must start with #';
      return null;
    };
  }, [registry]);

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
