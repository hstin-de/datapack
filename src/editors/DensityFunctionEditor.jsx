import React from 'react';
import { Card, FormField, FormGroup, Input, Select, EmptyState } from '../ui';
import { ResourceLocationInput } from '../components';
import { REGISTRIES } from '../utils/vanilla-registry.js';

export function DensityFunctionEditor({ value, onChange, id, onIdChange }) {
  const density = value || {};

  const handleChange = (patch) => onChange({ ...density, ...patch });

  return (
    <div className="density-function-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Density Function ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="density_function"
              allowTags={false}
              placeholder="minecraft:overworld/base_3d_noise"
            />
          </FormField>
          <FormField label="Type">
            <Select
              value={density.type || ''}
              onChange={(e) => handleChange({ type: e.target.value })}
            >
              <option value="">Select type</option>
              {(REGISTRIES.density_function_type || []).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Configuration" collapsible>
        <FormGroup>
          <FormField label="Argument">
            <ResourceLocationInput
              value={density.argument || ''}
              onChange={(val) => handleChange({ argument: val })}
              registry="density_function"
              allowTags={false}
              placeholder="minecraft:overworld/ridges"
            />
          </FormField>
          <FormField label="Argument 1">
            <ResourceLocationInput
              value={density.argument1 || ''}
              onChange={(val) => handleChange({ argument1: val })}
              registry="density_function"
              allowTags={false}
              placeholder="minecraft:overworld/continents"
            />
          </FormField>
          <FormField label="Argument 2">
            <ResourceLocationInput
              value={density.argument2 || ''}
              onChange={(val) => handleChange({ argument2: val })}
              registry="density_function"
              allowTags={false}
              placeholder="minecraft:overworld/erosion"
            />
          </FormField>
          <FormField label="Min">
            <Input
              type="number"
              value={density.min ?? ''}
              onChange={(e) => handleChange({ min: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Max">
            <Input
              type="number"
              value={density.max ?? ''}
              onChange={(e) => handleChange({ max: Number(e.target.value) || 0 })}
            />
          </FormField>
        </FormGroup>

        <EmptyState message="More density function types will expand here." className="editor-placeholder" />
      </Card>
    </div>
  );
}
