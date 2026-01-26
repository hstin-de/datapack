import React, { useMemo } from 'react';
import { Card, FormField, FormGroup, Input, Select, Button, Checkbox } from '../ui';
import { ResourceLocationInput, RegistryTagInput, HeightProviderEditor } from '../components';
import { REGISTRIES } from '../utils/vanilla-registry.js';

const STRUCTURE_STEPS = [
  'raw_generation',
  'lakes',
  'local_modifications',
  'underground_structures',
  'surface_structures',
  'strongholds',
  'underground_ores',
  'underground_decoration',
  'fluid_springs',
  'vegetal_decoration',
  'top_layer_modification'
];

const TERRAIN_ADAPTATIONS = ['none', 'bury', 'beard_thin', 'beard_box', 'encapsulate'];

const SPAWN_CATEGORIES = REGISTRIES.mob_category || [
  'monster',
  'creature',
  'ambient',
  'axolotls',
  'underground_water_creature',
  'water_creature',
  'water_ambient',
  'misc'
];

export function StructureEditor({ value, onChange, id, onIdChange }) {
  const structure = value || {};

  const biomeMode = useMemo(() => {
    if (Array.isArray(structure.biomes)) return 'list';
    return 'single';
  }, [structure.biomes]);

  const handleChange = (patch) => onChange({ ...structure, ...patch });

  const handleBiomeModeChange = (mode) => {
    if (mode === 'list') handleChange({ biomes: [] });
    else handleChange({ biomes: '' });
  };

  const handleSpawnOverrideChange = (category, patch) => {
    handleChange({
      spawn_overrides: {
        ...(structure.spawn_overrides || {}),
        [category]: { ...(structure.spawn_overrides?.[category] || {}), ...patch }
      }
    });
  };

  const getSpawnOverride = (category) => structure.spawn_overrides?.[category] || { bounding_box: 'full', spawns: [] };

  return (
    <div className="structure-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Structure ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="structure"
              allowTags={false}
              placeholder="minecraft:ancient_city"
            />
          </FormField>
          <FormField label="Type">
            <ResourceLocationInput
              value={structure.type || ''}
              onChange={(val) => handleChange({ type: val })}
              allowTags={false}
              placeholder="minecraft:jigsaw"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Placement" collapsible>
        <FormGroup>
          <FormField label="Biome Mode">
            <Select value={biomeMode} onChange={(e) => handleBiomeModeChange(e.target.value)}>
              <option value="single">Single/Tag</option>
              <option value="list">List</option>
            </Select>
          </FormField>

          {biomeMode === 'single' ? (
            <FormField label="Biomes">
              <ResourceLocationInput
                value={typeof structure.biomes === 'string' ? structure.biomes : ''}
                onChange={(val) => handleChange({ biomes: val })}
                registry="biome"
                allowTags={true}
                placeholder="#minecraft:is_overworld"
              />
            </FormField>
          ) : (
            <FormField label="Biomes">
              <RegistryTagInput
                values={Array.isArray(structure.biomes) ? structure.biomes : []}
                onChange={(vals) => handleChange({ biomes: vals })}
                registry="biome"
                allowTags={false}
                placeholder="Add biome..."
              />
            </FormField>
          )}

          <FormField label="Step">
            <Select value={structure.step || STRUCTURE_STEPS[0]} onChange={(e) => handleChange({ step: e.target.value })}>
              {STRUCTURE_STEPS.map((step) => (
                <option key={step} value={step}>
                  {step}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField label="Terrain Adaptation">
            <Select
              value={structure.terrain_adaptation || 'none'}
              onChange={(e) => handleChange({ terrain_adaptation: e.target.value })}
            >
              {TERRAIN_ADAPTATIONS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </Select>
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Jigsaw Settings" collapsible>
        <FormGroup>
          <FormField label="Start Pool">
            <ResourceLocationInput
              value={structure.start_pool || ''}
              onChange={(val) => handleChange({ start_pool: val })}
              registry="template_pool"
              allowTags={false}
              placeholder="minecraft:village/plains/town_centers"
            />
          </FormField>
          <FormField label="Size">
            <Input
              type="number"
              min="0"
              max="20"
              value={structure.size ?? 7}
              onChange={(e) => handleChange({ size: Number(e.target.value) || 0 })}
            />
          </FormField>
          <HeightProviderEditor value={structure.start_height} onChange={(val) => handleChange({ start_height: val })} label="Start Height" />
          <FormField label="Start Jigsaw Name">
            <Input
              value={structure.start_jigsaw_name || ''}
              onChange={(e) => handleChange({ start_jigsaw_name: e.target.value })}
              placeholder="minecraft:city_anchor"
            />
          </FormField>
          <FormField label="Project Start To Heightmap">
            <Select
              value={structure.project_start_to_heightmap || ''}
              onChange={(e) => handleChange({ project_start_to_heightmap: e.target.value || undefined })}
            >
              <option value="">None</option>
              <option value="WORLD_SURFACE_WG">WORLD_SURFACE_WG</option>
              <option value="WORLD_SURFACE">WORLD_SURFACE</option>
              <option value="OCEAN_FLOOR_WG">OCEAN_FLOOR_WG</option>
              <option value="OCEAN_FLOOR">OCEAN_FLOOR</option>
              <option value="MOTION_BLOCKING">MOTION_BLOCKING</option>
              <option value="MOTION_BLOCKING_NO_LEAVES">MOTION_BLOCKING_NO_LEAVES</option>
            </Select>
          </FormField>
          <FormField label="Max Distance From Center">
            <Input
              type="number"
              min="1"
              max="128"
              value={structure.max_distance_from_center ?? 16}
              onChange={(e) => handleChange({ max_distance_from_center: Number(e.target.value) || 0 })}
            />
          </FormField>
          <FormField label="Use Expansion Hack">
            <Checkbox
              checked={Boolean(structure.use_expansion_hack)}
              onChange={(e) => handleChange({ use_expansion_hack: e.target.checked })}
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Spawn Overrides" collapsible>
        {SPAWN_CATEGORIES.map((category) => {
          const override = getSpawnOverride(category);
          return (
            <div key={category} className="structure-editor__spawn-category">
              <div className="structure-editor__spawn-header">
                <span>{category}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleSpawnOverrideChange(category, {
                      spawns: [...override.spawns, { type: 'minecraft:zombie', weight: 1, minCount: 1, maxCount: 1 }]
                    })
                  }
                >
                  Add Spawn
                </Button>
              </div>
              <FormField label="Bounding Box" horizontal={false}>
                <Select
                  value={override.bounding_box || 'full'}
                  onChange={(e) => handleSpawnOverrideChange(category, { bounding_box: e.target.value })}
                >
                  <option value="piece">piece</option>
                  <option value="full">full</option>
                </Select>
              </FormField>
              {override.spawns.map((spawn, index) => (
                <div key={`${category}-${index}`} className="structure-editor__spawn-row">
                  <ResourceLocationInput
                    value={spawn.type}
                    onChange={(val) => {
                      const next = override.spawns.map((entry, i) => (i === index ? { ...entry, type: val } : entry));
                      handleSpawnOverrideChange(category, { spawns: next });
                    }}
                    registry="entity_type"
                    allowTags={false}
                    placeholder="minecraft:zombie"
                  />
                  <Input
                    type="number"
                    min="0"
                    value={spawn.weight}
                    onChange={(e) => {
                      const next = override.spawns.map((entry, i) =>
                        i === index ? { ...entry, weight: Number(e.target.value) || 0 } : entry
                      );
                      handleSpawnOverrideChange(category, { spawns: next });
                    }}
                  />
                  <Input
                    type="number"
                    min="0"
                    value={spawn.minCount}
                    onChange={(e) => {
                      const next = override.spawns.map((entry, i) =>
                        i === index ? { ...entry, minCount: Number(e.target.value) || 0 } : entry
                      );
                      handleSpawnOverrideChange(category, { spawns: next });
                    }}
                  />
                  <Input
                    type="number"
                    min="0"
                    value={spawn.maxCount}
                    onChange={(e) => {
                      const next = override.spawns.map((entry, i) =>
                        i === index ? { ...entry, maxCount: Number(e.target.value) || 0 } : entry
                      );
                      handleSpawnOverrideChange(category, { spawns: next });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const next = override.spawns.filter((_, i) => i !== index);
                      handleSpawnOverrideChange(category, { spawns: next });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </Card>
    </div>
  );
}
