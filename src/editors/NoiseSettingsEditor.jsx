import React from 'react';
import { Card, FormField, FormGroup, Input, Checkbox, EmptyState } from '../ui';
import { ResourceLocationInput, BlockStateEditor } from '../components';

export function NoiseSettingsEditor({ value, onChange, id, onIdChange }) {
  const settings = value || {};

  const handleChange = (patch) => onChange({ ...settings, ...patch });
  const noise = settings.noise || {};
  const handleNoiseChange = (patch) => handleChange({ noise: { ...noise, ...patch } });

  const sizeH = noise.size_horizontal ?? 1;

  return (
    <div className="noise-settings-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Noise Settings ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="noise_settings"
              allowTags={false}
              placeholder="minecraft:overworld"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Defaults" collapsible>
        <FormGroup>
          <BlockStateEditor
            value={settings.default_block}
            onChange={(val) => handleChange({ default_block: val })}
          />
          <BlockStateEditor
            value={settings.default_fluid}
            onChange={(val) => handleChange({ default_fluid: val })}
          />
          <FormField label="Sea Level">
            <Input
              type="number"
              value={settings.sea_level ?? 63}
              onChange={(e) => handleChange({ sea_level: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Disable Mob Generation">
            <Checkbox
              checked={Boolean(settings.disable_mob_generation)}
              onChange={(e) => handleChange({ disable_mob_generation: e.target.checked })}
            />
          </FormField>
          <FormField label="Aquifers Enabled">
            <Checkbox
              checked={Boolean(settings.aquifers_enabled)}
              onChange={(e) => handleChange({ aquifers_enabled: e.target.checked })}
            />
          </FormField>
          <FormField label="Ore Veins Enabled">
            <Checkbox
              checked={Boolean(settings.ore_veins_enabled)}
              onChange={(e) => handleChange({ ore_veins_enabled: e.target.checked })}
            />
          </FormField>
          <FormField label="Legacy Random Source">
            <Checkbox
              checked={Boolean(settings.legacy_random_source)}
              onChange={(e) => handleChange({ legacy_random_source: e.target.checked })}
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Noise" collapsible>
        <FormGroup>
          <FormField label="Biome Scale" hint="Higher = larger biomes. Sets size_horizontal (1–4, integer).">
            <div className="noise-settings-editor__scale">
              <span className="noise-settings-editor__scale-value">{sizeH}</span>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={sizeH}
                onChange={(e) => handleNoiseChange({ size_horizontal: Number(e.target.value) })}
                className="noise-settings-editor__scale-slider"
              />
              <span className="noise-settings-editor__scale-labels">
                <span>1 = vanilla</span>
                <span>4 = max</span>
              </span>
            </div>
          </FormField>
          <FormField label="Min Y">
            <Input
              type="number"
              value={noise.min_y ?? -64}
              onChange={(e) => handleNoiseChange({ min_y: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Height">
            <Input
              type="number"
              value={noise.height ?? 384}
              onChange={(e) => handleNoiseChange({ height: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Size Horizontal" hint="Integer, 1–4">
            <Input
              type="number"
              min="1"
              max="4"
              step="1"
              value={noise.size_horizontal ?? 1}
              onChange={(e) => handleNoiseChange({ size_horizontal: Math.min(4, Math.max(1, Math.round(Number(e.target.value) || 1))) })}
            />
          </FormField>
          <FormField label="Size Vertical">
            <Input
              type="number"
              min="1"
              step="1"
              value={noise.size_vertical ?? 2}
              onChange={(e) => handleNoiseChange({ size_vertical: Number(e.target.value) || 1 })}
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Noise Router" collapsible>
        <EmptyState message="Noise router editor coming next." className="editor-placeholder" />
      </Card>

      <Card title="Surface Rule" collapsible>
        <EmptyState message="Surface rule editor coming next." className="editor-placeholder" />
      </Card>
    </div>
  );
}
