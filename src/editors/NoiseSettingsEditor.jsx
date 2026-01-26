import React from 'react';
import { Card, FormField, FormGroup, Input, Checkbox, EmptyState } from '../ui';
import { ResourceLocationInput, BlockStateEditor } from '../components';

export function NoiseSettingsEditor({ value, onChange, id, onIdChange }) {
  const settings = value || {};

  const handleChange = (patch) => onChange({ ...settings, ...patch });

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

      <Card title="Noise Router" collapsible>
        <EmptyState message="Noise router editor coming next." className="editor-placeholder" />
      </Card>

      <Card title="Surface Rule" collapsible>
        <EmptyState message="Surface rule editor coming next." className="editor-placeholder" />
      </Card>
    </div>
  );
}
