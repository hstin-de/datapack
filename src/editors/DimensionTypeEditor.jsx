import React from 'react';
import { Card, Checkbox, FormField, FormGroup, Input } from '../ui';
import { ResourceLocationInput } from '../components';

export function DimensionTypeEditor({ value, onChange, id, onIdChange }) {
  const dt = value || {};
  const handleChange = (patch) => onChange({ ...dt, ...patch });

  return (
    <div className="dimension-type-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Dimension Type ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              allowTags={false}
              placeholder="mypack:custom_dimension_type"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Properties" collapsible>
        <FormGroup>
          <FormField label="Min Y">
            <Input type="number" value={dt.min_y ?? -64} onChange={(e) => handleChange({ min_y: Number(e.target.value) })} />
          </FormField>
          <FormField label="Height">
            <Input type="number" value={dt.height ?? 384} onChange={(e) => handleChange({ height: Number(e.target.value) })} />
          </FormField>
          <FormField label="Logical Height">
            <Input type="number" value={dt.logical_height ?? 384} onChange={(e) => handleChange({ logical_height: Number(e.target.value) })} />
          </FormField>
          <FormField label="Coordinate Scale">
            <Input type="number" step="0.01" value={dt.coordinate_scale ?? 1.0} onChange={(e) => handleChange({ coordinate_scale: Number(e.target.value) })} />
          </FormField>
          <FormField label="Ambient Light">
            <Input type="number" step="0.05" value={dt.ambient_light ?? 0.0} onChange={(e) => handleChange({ ambient_light: Number(e.target.value) })} />
          </FormField>
          <FormField label="Fixed Time" help="Leave empty for normal day/night cycle">
            <Input type="number" value={dt.fixed_time ?? ''} onChange={(e) => handleChange({ fixed_time: e.target.value === '' ? undefined : Number(e.target.value) })} />
          </FormField>
          <FormField label="Infiniburn">
            <ResourceLocationInput value={dt.infiniburn ?? '#minecraft:infiniburn_overworld'} onChange={(v) => handleChange({ infiniburn: v })} allowTags={true} />
          </FormField>
          <FormField label="Effects">
            <ResourceLocationInput value={dt.effects ?? 'minecraft:overworld'} onChange={(v) => handleChange({ effects: v })} allowTags={false} />
          </FormField>
          <FormField label="Monster Spawn Light Level">
            <Input type="number" value={typeof dt.monster_spawn_light_level === 'number' ? dt.monster_spawn_light_level : 0} onChange={(e) => handleChange({ monster_spawn_light_level: Number(e.target.value) })} />
          </FormField>
          <FormField label="Monster Spawn Block Light Limit">
            <Input type="number" value={dt.monster_spawn_block_light_limit ?? 0} onChange={(e) => handleChange({ monster_spawn_block_light_limit: Number(e.target.value) })} />
          </FormField>
        </FormGroup>

        <FormGroup>
          <FormField label="Flags">
            <Checkbox checked={Boolean(dt.ultrawarm)} onChange={(e) => handleChange({ ultrawarm: e.target.checked })} label="Ultrawarm" />
            <Checkbox checked={Boolean(dt.natural)} onChange={(e) => handleChange({ natural: e.target.checked })} label="Natural" />
            <Checkbox checked={Boolean(dt.piglin_safe)} onChange={(e) => handleChange({ piglin_safe: e.target.checked })} label="Piglin Safe" />
            <Checkbox checked={Boolean(dt.respawn_anchor_works)} onChange={(e) => handleChange({ respawn_anchor_works: e.target.checked })} label="Respawn Anchor Works" />
            <Checkbox checked={Boolean(dt.bed_works)} onChange={(e) => handleChange({ bed_works: e.target.checked })} label="Bed Works" />
            <Checkbox checked={dt.has_skylight !== false} onChange={(e) => handleChange({ has_skylight: e.target.checked })} label="Has Skylight" />
            <Checkbox checked={dt.has_ceiling !== undefined ? Boolean(dt.has_ceiling) : false} onChange={(e) => handleChange({ has_ceiling: e.target.checked })} label="Has Ceiling" />
            <Checkbox checked={Boolean(dt.has_raids)} onChange={(e) => handleChange({ has_raids: e.target.checked })} label="Has Raids" />
          </FormField>
        </FormGroup>
      </Card>
    </div>
  );
}
