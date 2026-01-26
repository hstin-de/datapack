import React, { useMemo } from 'react';
import { FormField, Input, Select } from '../ui';

const ANCHOR_TYPES = [
  { id: 'absolute', label: 'Absolute' },
  { id: 'above_bottom', label: 'Above Bottom' },
  { id: 'below_top', label: 'Below Top' }
];

export function VerticalAnchorEditor({ value, onChange, label = 'Anchor' }) {
  const current = useMemo(() => {
    if (!value || typeof value !== 'object') return { type: 'absolute', amount: 0 };
    const key = Object.keys(value)[0];
    return { type: key, amount: value[key] ?? 0 };
  }, [value]);

  const handleTypeChange = (type) => {
    onChange({ [type]: current.amount ?? 0 });
  };

  const handleAmountChange = (amount) => {
    onChange({ [current.type]: amount });
  };

  return (
    <FormField label={label} horizontal={false}>
      <div className="editor-row">
        <Select value={current.type} onChange={(e) => handleTypeChange(e.target.value)}>
          {ANCHOR_TYPES.map((anchor) => (
            <option key={anchor.id} value={anchor.id}>
              {anchor.label}
            </option>
          ))}
        </Select>
        <Input
          type="number"
          value={current.amount}
          onChange={(e) => handleAmountChange(Number(e.target.value) || 0)}
        />
      </div>
    </FormField>
  );
}
