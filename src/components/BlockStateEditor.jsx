import React from 'react';
import { Button, FormField, Input } from '../ui';
import { ResourceLocationInput } from './ResourceLocationInput.jsx';

export function BlockStateEditor({ value, onChange }) {
  const state = value || { Name: '' };
  const props = state.Properties || {};
  const entries = Object.entries(props);

  const handlePropertyChange = (index, key, val) => {
    const nextEntries = entries.map(([k, v], i) => (i === index ? [key ?? k, val ?? v] : [k, v]));
    const nextProps = Object.fromEntries(nextEntries.filter(([k]) => k));
    onChange({ ...state, Properties: nextProps });
  };

  const handleAddProperty = () => {
    const nextEntries = [...entries, ['', '']];
    onChange({ ...state, Properties: Object.fromEntries(nextEntries) });
  };

  const handleRemoveProperty = (index) => {
    const nextEntries = entries.filter((_, i) => i !== index);
    onChange({ ...state, Properties: Object.fromEntries(nextEntries) });
  };

  return (
    <div className="block-state-editor">
      <FormField label="Block" horizontal={false}>
        <ResourceLocationInput
          value={state.Name || ''}
          onChange={(val) => onChange({ ...state, Name: val })}
          registry="block"
          allowTags={false}
          placeholder="minecraft:stone"
        />
      </FormField>

      <div className="editor-section-header">
        <span>Properties</span>
        <Button variant="secondary" size="sm" onClick={handleAddProperty}>
          Add Property
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="editor-placeholder">No properties set.</div>
      ) : (
        entries.map(([key, val], index) => (
          <div key={`${key}-${index}`} className="block-state-editor__row">
            <Input
              value={key}
              onChange={(e) => handlePropertyChange(index, e.target.value, val)}
              placeholder="Property"
            />
            <Input
              value={val}
              onChange={(e) => handlePropertyChange(index, key, e.target.value)}
              placeholder="Value"
            />
            <Button variant="ghost" size="sm" onClick={() => handleRemoveProperty(index)}>
              Remove
            </Button>
          </div>
        ))
      )}
    </div>
  );
}
