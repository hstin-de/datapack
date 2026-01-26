import React from 'react';
import { Card, FormField, FormGroup, Input, Checkbox, Button } from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';

export function FlatLevelGeneratorPresetEditor({ value, onChange, id, onIdChange }) {
  const preset = value || { display: '', settings: { biome: '', features: false, lakes: false, layers: [] } };
  const settings = preset.settings || {};

  const handleChange = (patch) => onChange({ ...preset, ...patch });
  const handleSettingsChange = (patch) => handleChange({ settings: { ...settings, ...patch } });

  const handleLayerChange = (index, patch) => {
    const next = (settings.layers || []).map((layer, i) => (i === index ? { ...layer, ...patch } : layer));
    handleSettingsChange({ layers: next });
  };

  return (
    <div className="flat-preset-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Preset ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="flat_level_generator_preset"
              allowTags={false}
              placeholder="minecraft:classic_flat"
            />
          </FormField>
          <FormField label="Display Item">
            <ResourceLocationInput
              value={preset.display || ''}
              onChange={(val) => handleChange({ display: val })}
              registry="block"
              allowTags={false}
              placeholder="minecraft:grass_block"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Settings" collapsible>
        <FormGroup>
          <FormField label="Biome">
            <ResourceLocationInput
              value={settings.biome || ''}
              onChange={(val) => handleSettingsChange({ biome: val })}
              registry="biome"
              allowTags={false}
              placeholder="minecraft:plains"
            />
          </FormField>
          <FormField label="Features">
            <Checkbox
              checked={Boolean(settings.features)}
              onChange={(e) => handleSettingsChange({ features: e.target.checked })}
            />
          </FormField>
          <FormField label="Lakes">
            <Checkbox
              checked={Boolean(settings.lakes)}
              onChange={(e) => handleSettingsChange({ lakes: e.target.checked })}
            />
          </FormField>
        </FormGroup>

        <div className="editor-section-header">
          <span>Layers</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSettingsChange({ layers: [...(settings.layers || []), { block: 'minecraft:stone', height: 1 }] })}
          >
            Add Layer
          </Button>
        </div>
        {(settings.layers || []).map((layer, index) => (
          <div key={index} className="flat-preset-editor__row">
            <ResourceLocationInput
              value={layer.block || ''}
              onChange={(val) => handleLayerChange(index, { block: val })}
              registry="block"
              allowTags={false}
              placeholder="minecraft:stone"
            />
            <Input
              type="number"
              min="0"
              value={layer.height ?? 1}
              onChange={(e) => handleLayerChange(index, { height: Number(e.target.value) || 0 })}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSettingsChange({ layers: settings.layers.filter((_, i) => i !== index) })}
            >
              Remove
            </Button>
          </div>
        ))}

        <FormField label="Structure Overrides">
          <RegistryTagInput
            values={settings.structure_overrides || []}
            onChange={(vals) => handleSettingsChange({ structure_overrides: vals })}
            registry="structure_set"
            allowTags={false}
            placeholder="Add structure override..."
          />
        </FormField>
      </Card>
    </div>
  );
}
