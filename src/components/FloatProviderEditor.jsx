import React, { useMemo } from 'react';
import { FormField, Input, Select } from '../ui';

const FLOAT_TYPES = [
  { id: 'literal', label: 'Literal' },
  { id: 'minecraft:constant', label: 'Constant' },
  { id: 'minecraft:uniform', label: 'Uniform' },
  { id: 'minecraft:clamped_normal', label: 'Clamped Normal' },
  { id: 'minecraft:trapezoid', label: 'Trapezoid' }
];

export function FloatProviderEditor({ value, onChange, label = 'Value' }) {
  const currentType = useMemo(() => {
    if (typeof value === 'number') return 'literal';
    return value?.type || 'minecraft:constant';
  }, [value]);

  const handleTypeChange = (type) => {
    if (type === 'literal') onChange(0);
    else if (type === 'minecraft:constant') onChange({ type, value: 0 });
    else if (type === 'minecraft:uniform') onChange({ type, min_inclusive: 0, max_exclusive: 1 });
    else if (type === 'minecraft:clamped_normal') onChange({ type, mean: 0, deviation: 1, min: 0, max: 1 });
    else if (type === 'minecraft:trapezoid') onChange({ type, min: 0, max: 1, plateau: 0.5 });
  };

  return (
    <div className="float-provider-editor">
      <FormField label={`${label} Type`} horizontal={false}>
        <Select value={currentType} onChange={(e) => handleTypeChange(e.target.value)}>
          {FLOAT_TYPES.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.label}
            </option>
          ))}
        </Select>
      </FormField>

      {currentType === 'literal' && (
        <FormField label={label} horizontal={false}>
          <Input
            type="number"
            value={typeof value === 'number' ? value : 0}
            onChange={(e) => onChange(Number(e.target.value) || 0)}
          />
        </FormField>
      )}

      {currentType === 'minecraft:constant' && (
        <FormField label="Value" horizontal={false}>
          <Input
            type="number"
            value={value?.value ?? 0}
            onChange={(e) => onChange({ type: 'minecraft:constant', value: Number(e.target.value) || 0 })}
          />
        </FormField>
      )}

      {currentType === 'minecraft:uniform' && (
        <>
          <FormField label="Min Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.min_inclusive ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:uniform', min_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max Exclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.max_exclusive ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:uniform', max_exclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
        </>
      )}

      {currentType === 'minecraft:clamped_normal' && (
        <>
          <FormField label="Mean" horizontal={false}>
            <Input
              type="number"
              value={value?.mean ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', mean: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Deviation" horizontal={false}>
            <Input
              type="number"
              value={value?.deviation ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', deviation: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Min" horizontal={false}>
            <Input
              type="number"
              value={value?.min ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', min: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max" horizontal={false}>
            <Input
              type="number"
              value={value?.max ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', max: Number(e.target.value) || 0 })
              }
            />
          </FormField>
        </>
      )}

      {currentType === 'minecraft:trapezoid' && (
        <>
          <FormField label="Min" horizontal={false}>
            <Input
              type="number"
              value={value?.min ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:trapezoid', min: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max" horizontal={false}>
            <Input
              type="number"
              value={value?.max ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:trapezoid', max: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Plateau" horizontal={false}>
            <Input
              type="number"
              value={value?.plateau ?? 0.5}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:trapezoid', plateau: Number(e.target.value) || 0 })
              }
            />
          </FormField>
        </>
      )}
    </div>
  );
}
