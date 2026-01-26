import React, { useMemo } from 'react';
import { FormField, Input, Select } from '../ui';
import { WeightedListEditor } from './WeightedListEditor.jsx';

const INT_TYPES = [
  { id: 'literal', label: 'Literal' },
  { id: 'minecraft:constant', label: 'Constant' },
  { id: 'minecraft:uniform', label: 'Uniform' },
  { id: 'minecraft:biased_to_bottom', label: 'Biased to Bottom' },
  { id: 'minecraft:clamped', label: 'Clamped' },
  { id: 'minecraft:clamped_normal', label: 'Clamped Normal' },
  { id: 'minecraft:weighted_list', label: 'Weighted List' }
];

export function IntProviderEditor({ value, onChange, label = 'Value' }) {
  const currentType = useMemo(() => {
    if (typeof value === 'number') return 'literal';
    return value?.type || 'minecraft:constant';
  }, [value]);

  const handleTypeChange = (type) => {
    if (type === 'literal') onChange(0);
    else if (type === 'minecraft:constant') onChange({ type, value: 0 });
    else if (type === 'minecraft:uniform') onChange({ type, min_inclusive: 0, max_inclusive: 1 });
    else if (type === 'minecraft:biased_to_bottom') onChange({ type, min_inclusive: 0, max_inclusive: 1 });
    else if (type === 'minecraft:clamped') onChange({ type, source: 0, min_inclusive: 0, max_inclusive: 1 });
    else if (type === 'minecraft:clamped_normal') onChange({ type, mean: 0, deviation: 1, min_inclusive: 0, max_inclusive: 1 });
    else if (type === 'minecraft:weighted_list') onChange({ type, distribution: [] });
  };

  return (
    <div className="int-provider-editor">
      <FormField label={`${label} Type`} horizontal={false}>
        <Select value={currentType} onChange={(e) => handleTypeChange(e.target.value)}>
          {INT_TYPES.map((entry) => (
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

      {(currentType === 'minecraft:uniform' || currentType === 'minecraft:biased_to_bottom') && (
        <>
          <FormField label="Min Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.min_inclusive ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: currentType, min_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.max_inclusive ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: currentType, max_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
        </>
      )}

      {currentType === 'minecraft:clamped' && (
        <>
          <FormField label="Source" horizontal={false}>
            <Input
              type="number"
              value={typeof value?.source === 'number' ? value.source : 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped', source: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Min Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.min_inclusive ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped', min_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.max_inclusive ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped', max_inclusive: Number(e.target.value) || 0 })
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
          <FormField label="Min Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.min_inclusive ?? 0}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', min_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
          <FormField label="Max Inclusive" horizontal={false}>
            <Input
              type="number"
              value={value?.max_inclusive ?? 1}
              onChange={(e) =>
                onChange({ ...value, type: 'minecraft:clamped_normal', max_inclusive: Number(e.target.value) || 0 })
              }
            />
          </FormField>
        </>
      )}

      {currentType === 'minecraft:weighted_list' && (
        <WeightedListEditor
          entries={value?.distribution || []}
          onChange={(distribution) =>
            onChange({ type: 'minecraft:weighted_list', distribution })
          }
          renderEntry={(data, update) => (
            <FormField label="Value" horizontal={false}>
              <Input
                type="number"
                value={typeof data === 'number' ? data : 0}
                onChange={(e) => update(Number(e.target.value) || 0)}
              />
            </FormField>
          )}
        />
      )}
    </div>
  );
}
