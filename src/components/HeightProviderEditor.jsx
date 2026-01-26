import React, { useMemo } from 'react';
import { FormField, Input, Select } from '../ui';
import { VerticalAnchorEditor } from './VerticalAnchorEditor.jsx';

const HEIGHT_TYPES = [
  { id: 'anchor', label: 'Anchor' },
  { id: 'minecraft:constant', label: 'Constant' },
  { id: 'minecraft:uniform', label: 'Uniform' },
  { id: 'minecraft:biased_to_bottom', label: 'Biased to Bottom' },
  { id: 'minecraft:very_biased_to_bottom', label: 'Very Biased to Bottom' },
  { id: 'minecraft:trapezoid', label: 'Trapezoid' }
];

export function HeightProviderEditor({ value, onChange, label = 'Height' }) {
  const currentType = useMemo(() => {
    if (!value) return 'anchor';
    if (value.absolute != null || value.above_bottom != null || value.below_top != null) return 'anchor';
    return value.type || 'minecraft:constant';
  }, [value]);

  const handleTypeChange = (type) => {
    if (type === 'anchor') onChange({ absolute: 0 });
    else if (type === 'minecraft:constant') onChange({ type, value: { absolute: 0 } });
    else if (type === 'minecraft:uniform') onChange({ type, min_inclusive: { absolute: 0 }, max_inclusive: { absolute: 0 } });
    else if (type === 'minecraft:biased_to_bottom' || type === 'minecraft:very_biased_to_bottom') {
      onChange({ type, min_inclusive: { absolute: 0 }, max_inclusive: { absolute: 0 }, inner: 1 });
    } else if (type === 'minecraft:trapezoid') {
      onChange({ type, min_inclusive: { absolute: 0 }, max_inclusive: { absolute: 0 }, plateau: 1 });
    }
  };

  return (
    <div className="height-provider-editor">
      <FormField label={`${label} Type`} horizontal={false}>
        <Select value={currentType} onChange={(e) => handleTypeChange(e.target.value)}>
          {HEIGHT_TYPES.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </Select>
      </FormField>

      {currentType === 'anchor' && (
        <VerticalAnchorEditor value={value} onChange={onChange} label={label} />
      )}

      {currentType === 'minecraft:constant' && (
        <VerticalAnchorEditor
          value={(value && value.value) || { absolute: 0 }}
          onChange={(next) => onChange({ type: 'minecraft:constant', value: next })}
          label="Value"
        />
      )}

      {currentType === 'minecraft:uniform' && (
        <>
          <VerticalAnchorEditor
            value={(value && value.min_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: 'minecraft:uniform', min_inclusive: next })}
            label="Min Inclusive"
          />
          <VerticalAnchorEditor
            value={(value && value.max_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: 'minecraft:uniform', max_inclusive: next })}
            label="Max Inclusive"
          />
        </>
      )}

      {(currentType === 'minecraft:biased_to_bottom' || currentType === 'minecraft:very_biased_to_bottom') && (
        <>
          <VerticalAnchorEditor
            value={(value && value.min_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: currentType, min_inclusive: next })}
            label="Min Inclusive"
          />
          <VerticalAnchorEditor
            value={(value && value.max_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: currentType, max_inclusive: next })}
            label="Max Inclusive"
          />
          <FormField label="Inner" horizontal={false}>
            <Input
              type="number"
              min="1"
              value={(value && value.inner) || 1}
              onChange={(e) =>
                onChange({ ...value, type: currentType, inner: Number(e.target.value) || 1 })
              }
            />
          </FormField>
        </>
      )}

      {currentType === 'minecraft:trapezoid' && (
        <>
          <VerticalAnchorEditor
            value={(value && value.min_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: 'minecraft:trapezoid', min_inclusive: next })}
            label="Min Inclusive"
          />
          <VerticalAnchorEditor
            value={(value && value.max_inclusive) || { absolute: 0 }}
            onChange={(next) => onChange({ ...value, type: 'minecraft:trapezoid', max_inclusive: next })}
            label="Max Inclusive"
          />
          <FormField label="Plateau" horizontal={false}>
            <Input
              type="number"
              min="0"
              value={(value && value.plateau) || 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:trapezoid', plateau: Number(e.target.value) || 1 })
              }
            />
          </FormField>
        </>
      )}
    </div>
  );
}
