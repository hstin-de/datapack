import React from 'react';
import { Card, FormField, FormGroup, Button, EmptyState } from '../ui';
import { ResourceLocationInput } from '../components';

const defaultPlacement = { type: 'minecraft:count' };

export function PlacedFeatureEditor({ value, onChange, id, onIdChange }) {
  const placed = value || {};
  const placements = Array.isArray(placed.placement) ? placed.placement : [];

  const handleChange = (patch) => onChange({ ...placed, ...patch });

  const handlePlacementChange = (index, patch) => {
    const next = placements.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    handleChange({ placement: next });
  };

  const handleAddPlacement = () => {
    handleChange({ placement: [...placements, { ...defaultPlacement }] });
  };

  const handleRemovePlacement = (index) => {
    handleChange({ placement: placements.filter((_, i) => i !== index) });
  };

  return (
    <div className="placed-feature-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Placed Feature ID" help="Datapack registry name">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="placed_feature"
              allowTags={false}
              placeholder="minecraft:ore_diamond_buried"
            />
          </FormField>
          <FormField label="Feature">
            <ResourceLocationInput
              value={placed.feature || ''}
              onChange={(val) => handleChange({ feature: val })}
              registry="configured_feature"
              allowTags={false}
              placeholder="minecraft:ore_diamond"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Placement Modifiers" collapsible>
        <div className="editor-section-header">
          <span>Placement Chain</span>
          <Button variant="secondary" size="sm" onClick={handleAddPlacement}>
            Add Modifier
          </Button>
        </div>

        {placements.length === 0 ? (
          <EmptyState message="No placement modifiers yet." className="editor-placeholder" />
        ) : (
          placements.map((placement, index) => (
            <div key={index} className="placed-feature-editor__row">
              <FormField label="Modifier Type" horizontal={false}>
                <ResourceLocationInput
                  value={placement.type || ''}
                  onChange={(val) => handlePlacementChange(index, { type: val })}
                  registry="placement_type"
                  allowTags={false}
                  placeholder="minecraft:count"
                />
              </FormField>
              <div className="placed-feature-editor__row-actions">
                <Button variant="ghost" size="sm" onClick={() => handleRemovePlacement(index)}>
                  Remove
                </Button>
              </div>
              <EmptyState
                message="Modifier configuration editors will appear here."
                className="editor-placeholder"
              />
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
