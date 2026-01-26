import React from 'react';
import { Card, FormField, FormGroup, Input, Select } from '../ui';
import {
  ResourceLocationInput,
  TagReferenceInput,
  HeightProviderEditor,
  FloatProviderEditor,
  VerticalAnchorEditor,
  BlockStateEditor
} from '../components';

const CARVER_TYPES = ['minecraft:cave', 'minecraft:nether_cave', 'minecraft:canyon'];

export function ConfiguredCarverEditor({ value, onChange, id, onIdChange }) {
  const carver = value || { type: 'minecraft:cave', config: {} };
  const config = carver.config || {};

  const handleChange = (patch) => onChange({ ...carver, ...patch });
  const handleConfigChange = (patch) => handleChange({ config: { ...config, ...patch } });

  return (
    <div className="configured-carver-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Carver ID" help="Datapack registry name">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="configured_carver"
              allowTags={false}
              placeholder="minecraft:cave"
            />
          </FormField>
          <FormField label="Type">
            <Select value={carver.type || 'minecraft:cave'} onChange={(e) => handleChange({ type: e.target.value })}>
              {CARVER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Configuration" collapsible>
        <FormGroup>
          <FormField label="Probability">
            <Input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={config.probability ?? 0}
              onChange={(e) => handleConfigChange({ probability: Number(e.target.value) || 0 })}
            />
          </FormField>

          <HeightProviderEditor value={config.y} onChange={(val) => handleConfigChange({ y: val })} label="Y" />
          <FloatProviderEditor value={config.yScale} onChange={(val) => handleConfigChange({ yScale: val })} label="Y Scale" />
          <VerticalAnchorEditor value={config.lava_level} onChange={(val) => handleConfigChange({ lava_level: val })} label="Lava Level" />
          <FormField label="Replaceable">
            <TagReferenceInput
              value={config.replaceable || ''}
              onChange={(val) => handleConfigChange({ replaceable: val })}
              registry="block_tag"
              placeholder="#minecraft:overworld_carver_replaceables"
            />
          </FormField>

          <FloatProviderEditor
            value={config.horizontal_radius_multiplier}
            onChange={(val) => handleConfigChange({ horizontal_radius_multiplier: val })}
            label="Horizontal Radius"
          />
          <FloatProviderEditor
            value={config.vertical_radius_multiplier}
            onChange={(val) => handleConfigChange({ vertical_radius_multiplier: val })}
            label="Vertical Radius"
          />
          <FloatProviderEditor
            value={config.floor_level}
            onChange={(val) => handleConfigChange({ floor_level: val })}
            label="Floor Level"
          />
        </FormGroup>

        {carver.type === 'minecraft:canyon' && (
          <FormGroup title="Canyon Shape">
            <FloatProviderEditor
              value={config.vertical_rotation}
              onChange={(val) => handleConfigChange({ vertical_rotation: val })}
              label="Vertical Rotation"
            />
            <FloatProviderEditor
              value={config.shape?.distance_factor}
              onChange={(val) =>
                handleConfigChange({ shape: { ...config.shape, distance_factor: val } })
              }
              label="Distance Factor"
            />
            <FloatProviderEditor
              value={config.shape?.thickness}
              onChange={(val) =>
                handleConfigChange({ shape: { ...config.shape, thickness: val } })
              }
              label="Thickness"
            />
          </FormGroup>
        )}

        <FormGroup title="Debug States" description="Optional block states for debug visualization">
          <BlockStateEditor
            value={config.debug_settings?.air_state}
            onChange={(val) =>
              handleConfigChange({
                debug_settings: { ...config.debug_settings, air_state: val }
              })
            }
          />
        </FormGroup>
      </Card>
    </div>
  );
}
