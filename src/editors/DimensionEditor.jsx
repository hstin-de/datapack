import React, { useMemo } from 'react';
import { Card, FormField, FormGroup, Input, Select } from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';

const GENERATOR_TYPES = ['minecraft:noise', 'minecraft:flat', 'minecraft:debug'];
const BIOME_SOURCE_TYPES = ['minecraft:multi_noise', 'minecraft:fixed', 'minecraft:checkerboard', 'minecraft:the_end'];

export function DimensionEditor({ value, onChange, id, onIdChange }) {
  const dimension = value || { type: '', generator: { type: 'minecraft:noise' } };
  const generator = dimension.generator || { type: 'minecraft:noise' };
  const biomeSource = generator.biome_source || {};

  const handleChange = (patch) => onChange({ ...dimension, ...patch });
  const handleGeneratorChange = (patch) => handleChange({ generator: { ...generator, ...patch } });
  const handleBiomeSourceChange = (patch) =>
    handleGeneratorChange({ biome_source: { ...biomeSource, ...patch } });

  const generatorType = generator.type || 'minecraft:noise';
  const biomeSourceType = biomeSource.type || 'minecraft:multi_noise';

  const checkerboardBiomes = useMemo(() => biomeSource.biomes || [], [biomeSource.biomes]);

  return (
    <div className="dimension-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Dimension ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="dimension_type"
              allowTags={false}
              placeholder="minecraft:overworld"
            />
          </FormField>
          <FormField label="Dimension Type">
            <ResourceLocationInput
              value={dimension.type || ''}
              onChange={(val) => handleChange({ type: val })}
              registry="dimension_type"
              allowTags={false}
              placeholder="minecraft:overworld"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Generator" collapsible>
        <FormGroup>
          <FormField label="Generator Type">
            <Select value={generatorType} onChange={(e) => handleGeneratorChange({ type: e.target.value })}>
              {GENERATOR_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormField>

          {generatorType !== 'minecraft:debug' && (
            <>
              <FormField label="Biome Source Type">
                <Select
                  value={biomeSourceType}
                  onChange={(e) => handleBiomeSourceChange({ type: e.target.value })}
                >
                  {BIOME_SOURCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormField>

              {biomeSourceType === 'minecraft:fixed' && (
                <FormField label="Biome">
                  <ResourceLocationInput
                    value={biomeSource.biome || ''}
                    onChange={(val) => handleBiomeSourceChange({ biome: val })}
                    registry="biome"
                    allowTags={false}
                    placeholder="minecraft:plains"
                  />
                </FormField>
              )}

              {biomeSourceType === 'minecraft:multi_noise' && (
                <FormField label="Preset">
                  <ResourceLocationInput
                    value={biomeSource.preset || ''}
                    onChange={(val) => handleBiomeSourceChange({ preset: val })}
                    registry="multi_noise_preset"
                    allowTags={false}
                    placeholder="minecraft:overworld"
                  />
                </FormField>
              )}

              {biomeSourceType === 'minecraft:checkerboard' && (
                <>
                  <FormField label="Scale">
                    <Input
                      type="number"
                      min="1"
                      value={biomeSource.scale ?? 2}
                      onChange={(e) => handleBiomeSourceChange({ scale: Number(e.target.value) || 1 })}
                    />
                  </FormField>
                  <FormField label="Biomes">
                    <RegistryTagInput
                      values={checkerboardBiomes}
                      onChange={(vals) => handleBiomeSourceChange({ biomes: vals })}
                      registry="biome"
                      allowTags={false}
                      placeholder="Add biome..."
                    />
                  </FormField>
                </>
              )}
            </>
          )}

          {generatorType === 'minecraft:noise' && (
            <FormField label="Settings">
              <ResourceLocationInput
                value={generator.settings || ''}
                onChange={(val) => handleGeneratorChange({ settings: val })}
                registry="noise_settings"
                allowTags={false}
                placeholder="minecraft:overworld"
              />
            </FormField>
          )}

          {generatorType === 'minecraft:flat' && (
            <FormField label="Settings">
              <ResourceLocationInput
                value={generator.settings || ''}
                onChange={(val) => handleGeneratorChange({ settings: val })}
                registry="flat_level_generator_preset"
                allowTags={false}
                placeholder="minecraft:flat"
              />
            </FormField>
          )}
        </FormGroup>
      </Card>
    </div>
  );
}
