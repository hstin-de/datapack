import React from 'react';
import { Card, FormField, FormGroup, Input, Select, Button } from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';

const ELEMENT_TYPES = [
  'minecraft:empty_pool_element',
  'minecraft:feature_pool_element',
  'minecraft:legacy_single_pool_element',
  'minecraft:single_pool_element',
  'minecraft:list_pool_element'
];

const PROJECTIONS = ['terrain_matching', 'rigid'];

export function TemplatePoolEditor({ value, onChange, id, onIdChange }) {
  const pool = value || { elements: [], fallback: 'minecraft:empty' };

  const handleChange = (patch) => onChange({ ...pool, ...patch });

  const handleElementChange = (index, patch) => {
    const next = pool.elements.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    handleChange({ elements: next });
  };

  const handleElementDataChange = (index, patch) => {
    const entry = pool.elements[index] || {};
    handleElementChange(index, { element: { ...(entry.element || {}), ...patch } });
  };

  const addElement = () => {
    handleChange({
      elements: [
        ...(pool.elements || []),
        { weight: 1, element: { element_type: 'minecraft:empty_pool_element', projection: 'rigid' } }
      ]
    });
  };

  return (
    <div className="template-pool-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Template Pool ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="template_pool"
              allowTags={false}
              placeholder="minecraft:village/plains/town_centers"
            />
          </FormField>
          <FormField label="Fallback">
            <ResourceLocationInput
              value={pool.fallback || ''}
              onChange={(val) => handleChange({ fallback: val })}
              registry="template_pool"
              allowTags={false}
              placeholder="minecraft:empty"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Elements" collapsible>
        <div className="editor-section-header">
          <span>Pool Elements</span>
          <Button variant="secondary" size="sm" onClick={addElement}>
            Add Element
          </Button>
        </div>

        {(pool.elements || []).map((entry, index) => {
          const element = entry.element || {};
          return (
            <div key={index} className="template-pool-editor__row">
              <FormField label="Weight" horizontal={false}>
                <Input
                  type="number"
                  min="1"
                  value={entry.weight ?? 1}
                  onChange={(e) => handleElementChange(index, { weight: Number(e.target.value) || 1 })}
                />
              </FormField>
              <FormField label="Element Type" horizontal={false}>
                <Select
                  value={element.element_type || ELEMENT_TYPES[0]}
                  onChange={(e) => handleElementDataChange(index, { element_type: e.target.value })}
                >
                  {ELEMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Projection" horizontal={false}>
                <Select
                  value={element.projection || 'rigid'}
                  onChange={(e) => handleElementDataChange(index, { projection: e.target.value })}
                >
                  {PROJECTIONS.map((projection) => (
                    <option key={projection} value={projection}>
                      {projection}
                    </option>
                  ))}
                </Select>
              </FormField>

              {element.element_type === 'minecraft:feature_pool_element' && (
                <FormField label="Feature" horizontal={false}>
                  <ResourceLocationInput
                    value={element.feature || ''}
                    onChange={(val) => handleElementDataChange(index, { feature: val })}
                    registry="configured_feature"
                    allowTags={false}
                    placeholder="minecraft:ore_diamond"
                  />
                </FormField>
              )}

              {(element.element_type === 'minecraft:legacy_single_pool_element' ||
                element.element_type === 'minecraft:single_pool_element') && (
                <>
                  <FormField label="Location" horizontal={false}>
                    <Input
                      value={element.location || ''}
                      onChange={(e) => handleElementDataChange(index, { location: e.target.value })}
                      placeholder="minecraft:village/plains/houses/house"
                    />
                  </FormField>
                  <FormField label="Processors" horizontal={false}>
                    <ResourceLocationInput
                      value={element.processors || ''}
                      onChange={(val) => handleElementDataChange(index, { processors: val })}
                      registry="processor_list"
                      allowTags={false}
                      placeholder="minecraft:empty"
                    />
                  </FormField>
                </>
              )}

              {element.element_type === 'minecraft:list_pool_element' && (
                <FormField label="Elements" horizontal={false}>
                  <RegistryTagInput
                    values={element.elements || []}
                    onChange={(vals) => handleElementDataChange(index, { elements: vals })}
                    registry="template_pool"
                    allowTags={false}
                    placeholder="Add pool element..."
                  />
                </FormField>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleChange({ elements: pool.elements.filter((_, i) => i !== index) })}
              >
                Remove
              </Button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
