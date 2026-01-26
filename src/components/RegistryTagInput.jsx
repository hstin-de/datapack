import React, { useMemo } from 'react';
import { TagInput } from '../ui';
import { createFieldValidator, validateResourceLocation } from '../utils/validation.js';
import { REGISTRIES } from '../utils/vanilla-registry.js';

export function RegistryTagInput({
  values = [],
  onChange,
  registry,
  allowTags = false,
  placeholder = 'Add item...',
  disabled = false,
  className = '',
  ...props
}) {
  const suggestions = REGISTRIES[registry] || [];

  const validator = useMemo(
    () => createFieldValidator(validateResourceLocation, { allowTags, registry }),
    [allowTags, registry]
  );

  return (
    <TagInput
      values={values}
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
