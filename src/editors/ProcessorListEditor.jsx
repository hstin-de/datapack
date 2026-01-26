import React from 'react';
import { Card, FormField, FormGroup, Select, Button, EmptyState } from '../ui';
import { ResourceLocationInput } from '../components';

export function ProcessorListEditor({ value, onChange, id, onIdChange }) {
  const list = value || { processors: [] };

  const handleChange = (patch) => onChange({ ...list, ...patch });

  const handleProcessorChange = (index, patch) => {
    const next = list.processors.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    handleChange({ processors: next });
  };

  return (
    <div className="processor-list-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Processor List ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="processor_list"
              allowTags={false}
              placeholder="minecraft:ancient_city_walls_degradation"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Processors" collapsible>
        <div className="editor-section-header">
          <span>Processor Chain</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleChange({ processors: [...(list.processors || []), { processor_type: '' }] })}
          >
            Add Processor
          </Button>
        </div>

        {(list.processors || []).length === 0 ? (
          <EmptyState message="No processors yet." className="editor-placeholder" />
        ) : (
          list.processors.map((processor, index) => (
            <div key={index} className="processor-list-editor__row">
              <FormField label="Processor Type" horizontal={false}>
                <ResourceLocationInput
                  value={processor.processor_type || ''}
                  onChange={(val) => handleProcessorChange(index, { processor_type: val })}
                  registry="processor_type"
                  allowTags={false}
                  placeholder="minecraft:rule"
                />
              </FormField>
              <EmptyState message="Processor-specific config editor goes here." className="editor-placeholder" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChange({ processors: list.processors.filter((_, i) => i !== index) })}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
