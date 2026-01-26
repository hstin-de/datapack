import React from 'react';
import { Card, FormField, FormGroup, Input, Select, Button } from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';

const GENERATOR_TYPES = ['minecraft:noise', 'minecraft:flat', 'minecraft:debug'];
const BIOME_SOURCE_TYPES = ['minecraft:multi_noise', 'minecraft:fixed', 'minecraft:checkerboard', 'minecraft:the_end'];

export function WorldPresetEditor({ value, onChange, id, onIdChange }) {
  const preset = value || { dimensions: {} };
  const dimensionEntries = Object.entries(preset.dimensions || {});

  const handleChange = (patch) => onChange({ ...preset, ...patch });

  const handleDimensionChange = (dimensionId, patch) => {
    handleChange({
      dimensions: {
        ...preset.dimensions,
        [dimensionId]: {
          ...(preset.dimensions?.[dimensionId] || {}),
          ...patch
        }
      }
    });
  };

  const handleAddDimension = () => {
    const newId = 'minecraft:overworld';
    if (preset.dimensions?.[newId]) return;
    handleChange({
      dimensions: {
        ...preset.dimensions,
        [newId]: {
          type: 'minecraft:overworld',
          generator: { type: 'minecraft:noise', settings: 'minecraft:overworld', biome_source: { type: 'minecraft:multi_noise', preset: 'minecraft:overworld' } }
        }
      }
    });
  };

  const handleRemoveDimension = (dimensionId) => {
    const next = { ...(preset.dimensions || {}) };
    delete next[dimensionId];
    handleChange({ dimensions: next });
  };

  return (
    <div className="world-preset-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="World Preset ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="world_preset"
              allowTags={false}
              placeholder="minecraft:normal"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Dimensions" collapsible>
        <div className="editor-section-header">
          <span>Dimension Mappings</span>
          <Button variant="secondary" size="sm" onClick={handleAddDimension}>
            Add Dimension
          </Button>
        </div>

        {dimensionEntries.map(([dimensionId, dimension]) => {
          const generator = dimension.generator || {};
          const biomeSource = generator.biome_source || {};

          return (
            <div key={dimensionId} className="world-preset-editor__row">
              <FormField label="Dimension ID" horizontal={false}>
                <ResourceLocationInput
                  value={dimensionId}
                  onChange={(val) => {
                    if (!val || val === dimensionId) return;
                    const next = { ...(preset.dimensions || {}) };
                    next[val] = next[dimensionId];
                    delete next[dimensionId];
                    handleChange({ dimensions: next });
                  }}
                  registry="dimension_type"
                  allowTags={false}
                  placeholder="minecraft:overworld"
                />
              </FormField>
              <FormField label="Dimension Type" horizontal={false}>
                <ResourceLocationInput
                  value={dimension.type || ''}
                  onChange={(val) => handleDimensionChange(dimensionId, { type: val })}
                  registry="dimension_type"
                  allowTags={false}
                  placeholder="minecraft:overworld"
                />
              </FormField>

              <FormField label="Generator Type" horizontal={false}>
                <Select
                  value={generator.type || 'minecraft:noise'}
                  onChange={(e) =>
                    handleDimensionChange(dimensionId, { generator: { ...generator, type: e.target.value } })
                  }
                >
                  {GENERATOR_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormField>

              {generator.type !== 'minecraft:debug' && (
                <FormField label="Biome Source Type" horizontal={false}>
                  <Select
                    value={biomeSource.type || 'minecraft:multi_noise'}
                    onChange={(e) =>
                      handleDimensionChange(dimensionId, {
                        generator: { ...generator, biome_source: { ...biomeSource, type: e.target.value } }
                      })
                    }
                  >
                    {BIOME_SOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </FormField>
              )}

              {biomeSource.type === 'minecraft:fixed' && (
                <FormField label="Biome" horizontal={false}>
                  <ResourceLocationInput
                    value={biomeSource.biome || ''}
                    onChange={(val) =>
                      handleDimensionChange(dimensionId, {
                        generator: { ...generator, biome_source: { ...biomeSource, biome: val } }
                      })
                    }
                    registry="biome"
                    allowTags={false}
                    placeholder="minecraft:plains"
                  />
                </FormField>
              )}

              {biomeSource.type === 'minecraft:multi_noise' && (
                <FormField label="Preset" horizontal={false}>
                  <ResourceLocationInput
                    value={biomeSource.preset || ''}
                    onChange={(val) =>
                      handleDimensionChange(dimensionId, {
                        generator: { ...generator, biome_source: { ...biomeSource, preset: val } }
                      })
                    }
                    registry="multi_noise_preset"
                    allowTags={false}
                    placeholder="minecraft:overworld"
                  />
                </FormField>
              )}

              {biomeSource.type === 'minecraft:checkerboard' && (
                <>
                  <FormField label="Scale" horizontal={false}>
                    <Input
                      type="number"
                      min="1"
                      value={biomeSource.scale ?? 2}
                      onChange={(e) =>
                        handleDimensionChange(dimensionId, {
                          generator: { ...generator, biome_source: { ...biomeSource, scale: Number(e.target.value) || 1 } }
                        })
                      }
                    />
                  </FormField>
                  <FormField label="Biomes" horizontal={false}>
                    <RegistryTagInput
                      values={biomeSource.biomes || []}
                      onChange={(vals) =>
                        handleDimensionChange(dimensionId, {
                          generator: { ...generator, biome_source: { ...biomeSource, biomes: vals } }
                        })
                      }
                      registry="biome"
                      allowTags={false}
                      placeholder="Add biome..."
                    />
                  </FormField>
                </>
              )}

              {generator.type === 'minecraft:noise' && (
                <FormField label="Noise Settings" horizontal={false}>
                  <ResourceLocationInput
                    value={generator.settings || ''}
                    onChange={(val) =>
                      handleDimensionChange(dimensionId, { generator: { ...generator, settings: val } })
                    }
                    registry="noise_settings"
                    allowTags={false}
                    placeholder="minecraft:overworld"
                  />
                </FormField>
              )}

              {generator.type === 'minecraft:flat' && (
                <FormField label="Flat Settings" horizontal={false}>
                  <ResourceLocationInput
                    value={generator.settings || ''}
                    onChange={(val) =>
                      handleDimensionChange(dimensionId, { generator: { ...generator, settings: val } })
                    }
                    registry="flat_level_generator_preset"
                    allowTags={false}
                    placeholder="minecraft:flat"
                  />
                </FormField>
              )}

              <Button variant="ghost" size="sm" onClick={() => handleRemoveDimension(dimensionId)}>
                Remove Dimension
              </Button>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
