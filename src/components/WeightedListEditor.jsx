import React from 'react';
import { Button, FormField, Input } from '../ui';

export function WeightedListEditor({
  entries = [],
  onChange,
  renderEntry,
  addLabel = 'Add Entry'
}) {
  const handleEntryChange = (index, patch) => {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...entries, { weight: 1, data: {} }]);
  };

  const handleRemove = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  return (
    <div className="weighted-list-editor">
      <div className="editor-section-header">
        <span>Weighted Entries</span>
        <Button variant="secondary" size="sm" onClick={handleAdd}>
          {addLabel}
        </Button>
      </div>
      {entries.map((entry, index) => (
        <div key={index} className="weighted-list-editor__row">
          <FormField label="Weight" horizontal={false}>
            <Input
              type="number"
              min="1"
              value={entry.weight ?? 1}
              onChange={(e) =>
                handleEntryChange(index, { weight: Number(e.target.value) || 1 })
              }
            />
          </FormField>
          <div className="weighted-list-editor__content">
            {renderEntry?.(entry.data, (dataPatch) =>
              handleEntryChange(index, { data: { ...entry.data, ...dataPatch } })
            )}
          </div>
          <div className="weighted-list-editor__actions">
            <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
