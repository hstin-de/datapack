import React, { useMemo } from 'react';
import { Card, Checkbox, FormField, FormGroup, TagInput } from '../ui';
import { ResourceLocationInput } from '../components';
import { createFieldValidator, validateResourceLocation } from '../utils/validation.js';

export function TagEditor({ value, onChange, id, onIdChange }) {
  const tag = value || {};
  const values = Array.isArray(tag.values) ? tag.values : [];
  const replace = Boolean(tag.replace);

  const validator = useMemo(
    () => createFieldValidator(validateResourceLocation, { allowTags: true }),
    []
  );

  const handleChange = (patch) => onChange({ ...tag, ...patch });

  return (
    <div className="tag-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Tag ID" help="Namespace + path under data/<namespace>/tags/.">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="terralith:worldgen/biome/has_structure/witch_hut"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Values" collapsible>
        <FormGroup>
          <FormField label="Replace">
            <Checkbox
              checked={replace}
              onChange={(event) => handleChange({ replace: event.target.checked })}
              label="Replace existing tag values"
            />
          </FormField>
          <FormField label="Values">
            <TagInput
              values={values}
              onChange={(next) => handleChange({ values: next })}
              validator={validator}
              placeholder="minecraft:stone or #minecraft:base_stone_overworld"
            />
          </FormField>
        </FormGroup>
      </Card>
    </div>
  );
}
