import React, { useMemo } from 'react';
import {
  Card,
  FormField,
  FormGroup,
  Input,
  Checkbox,
  Select,
  ColorPicker,
  Button
} from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';
import {
  createFieldValidator,
  validateColor,
  entityTypeValidator
} from '../utils/validation.js';

const FEATURE_STEPS = [
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

const defaultEffects = {
  fog_color: 12638463,
  water_color: 4159204,
  water_fog_color: 329011,
  sky_color: 7907327
};

const SPAWNER_CATEGORIES = [
  { key: 'monster', label: 'Monster' },
  { key: 'creature', label: 'Creature' },
  { key: 'ambient', label: 'Ambient' },
  { key: 'axolotls', label: 'Axolotls' },
  { key: 'underground_water_creature', label: 'Underground Water Creature' },
  { key: 'water_creature', label: 'Water Creature' },
  { key: 'water_ambient', label: 'Water Ambient' },
  { key: 'misc', label: 'Misc' }
];

const defaultSpawnerEntry = {
  type: 'minecraft:zombie',
  weight: 1,
  minCount: 1,
  maxCount: 1
};

export function BiomeEditor({ value, onChange, id, onIdChange }) {
  const biome = value || {};
  const features = useMemo(() => {
    if (Array.isArray(biome.features)) {
      const normalized = biome.features.slice(0, FEATURE_STEPS.length);
      while (normalized.length < FEATURE_STEPS.length) normalized.push([]);
      return normalized;
    }
    return Array.from({ length: FEATURE_STEPS.length }, () => []);
  }, [biome.features]);

  const effects = { ...defaultEffects, ...(biome.effects || {}) };

  const carverMode = useMemo(() => {
    if (typeof biome.carvers === 'string') return 'single';
    if (Array.isArray(biome.carvers)) return 'list';
    if (biome.carvers && typeof biome.carvers === 'object') return 'channels';
    return 'list';
  }, [biome.carvers]);

  const handleChange = (patch) => onChange({ ...biome, ...patch });
  const handleEffectsChange = (patch) => handleChange({ effects: { ...effects, ...patch } });

  const handleSpawnerChange = (category, entries) => {
    handleChange({ spawners: { ...(biome.spawners || {}), [category]: entries } });
  };

  const getSpawnerEntries = (category) => (biome.spawners && biome.spawners[category]) || [];

  const handleCarverModeChange = (mode) => {
    if (mode === 'single') {
      handleChange({ carvers: '' });
    } else if (mode === 'channels') {
      handleChange({ carvers: { air: [], liquid: [] } });
    } else {
      handleChange({ carvers: [] });
    }
  };

  const handleFeatureLayerChange = (index, layer) => {
    const next = features.map((entries, i) => (i === index ? layer : entries));
    handleChange({ features: next });
  };

  return (
    <div className="biome-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Biome ID" help="Datapack registry name">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="biome"
              allowTags={false}
              placeholder="minecraft:plains"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Climate" collapsible>
        <FormGroup>
          <FormField label="Temperature">
            <Input
              type="number"
              value={biome.temperature ?? ''}
              onChange={(e) => handleChange({ temperature: Number(e.target.value) })}
              step="0.01"
            />
          </FormField>
          <FormField label="Downfall">
            <Input
              type="number"
              value={biome.downfall ?? ''}
              onChange={(e) => handleChange({ downfall: Number(e.target.value) })}
              step="0.01"
            />
          </FormField>
          <FormField label="Has Precipitation">
            <Checkbox
              checked={Boolean(biome.has_precipitation)}
              onChange={(e) => handleChange({ has_precipitation: e.target.checked })}
            />
          </FormField>
          <FormField label="Temp Modifier" help="Optional">
            <Select
              value={biome.temperature_modifier || ''}
              onChange={(e) => handleChange({ temperature_modifier: e.target.value || undefined })}
            >
              <option value="">None</option>
              <option value="frozen">frozen</option>
            </Select>
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Effects" collapsible>
        <FormGroup>
          <FormField label="Fog Color" error={createFieldValidator(validateColor)(effects.fog_color)}>
            <ColorPicker value={effects.fog_color} onChange={(val) => handleEffectsChange({ fog_color: val })} />
          </FormField>
          <FormField label="Water Color" error={createFieldValidator(validateColor)(effects.water_color)}>
            <ColorPicker value={effects.water_color} onChange={(val) => handleEffectsChange({ water_color: val })} />
          </FormField>
          <FormField label="Water Fog Color" error={createFieldValidator(validateColor)(effects.water_fog_color)}>
            <ColorPicker value={effects.water_fog_color} onChange={(val) => handleEffectsChange({ water_fog_color: val })} />
          </FormField>
          <FormField label="Sky Color" error={createFieldValidator(validateColor)(effects.sky_color)}>
            <ColorPicker value={effects.sky_color} onChange={(val) => handleEffectsChange({ sky_color: val })} />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Carvers" collapsible>
        <FormGroup>
          <FormField label="Format">
            <Select value={carverMode} onChange={(e) => handleCarverModeChange(e.target.value)}>
              <option value="list">List</option>
              <option value="single">Single</option>
              <option value="channels">Air/Liquid</option>
            </Select>
          </FormField>

          {carverMode === 'single' && (
            <FormField label="Carver">
              <ResourceLocationInput
                value={typeof biome.carvers === 'string' ? biome.carvers : ''}
                onChange={(val) => handleChange({ carvers: val })}
                registry="configured_carver"
                allowTags={false}
                placeholder="minecraft:cave"
              />
            </FormField>
          )}

          {carverMode === 'list' && (
            <FormField label="Carvers">
              <RegistryTagInput
                values={Array.isArray(biome.carvers) ? biome.carvers : []}
                onChange={(vals) => handleChange({ carvers: vals })}
                registry="configured_carver"
                allowTags={false}
                placeholder="Add carver..."
              />
            </FormField>
          )}

          {carverMode === 'channels' && (
            <>
              <FormField label="Air Carvers">
                <RegistryTagInput
                  values={(biome.carvers && biome.carvers.air) || []}
                  onChange={(vals) => handleChange({ carvers: { ...(biome.carvers || {}), air: vals } })}
                  registry="configured_carver"
                  allowTags={false}
                  placeholder="Add air carver..."
                />
              </FormField>
              <FormField label="Liquid Carvers">
                <RegistryTagInput
                  values={(biome.carvers && biome.carvers.liquid) || []}
                  onChange={(vals) => handleChange({ carvers: { ...(biome.carvers || {}), liquid: vals } })}
                  registry="configured_carver"
                  allowTags={false}
                  placeholder="Add liquid carver..."
                />
              </FormField>
            </>
          )}
        </FormGroup>
      </Card>

      <Card title="Features" collapsible>
        <FormGroup>
          {FEATURE_STEPS.map((step, index) => (
            <FormField key={step} label={step}>
              <RegistryTagInput
                values={features[index]}
                onChange={(vals) => handleFeatureLayerChange(index, vals)}
                registry="placed_feature"
                allowTags={false}
                placeholder="Add placed feature..."
              />
            </FormField>
          ))}
        </FormGroup>
      </Card>

      <Card title="Spawners" collapsible>
        <FormGroup>
          <FormField label="Creature Spawn Probability" help="Optional">
            <Input
              type="number"
              value={biome.creature_spawn_probability ?? ''}
              onChange={(e) => {
                const next = e.target.value === '' ? undefined : Number(e.target.value);
                handleChange({ creature_spawn_probability: next });
              }}
              step="0.01"
              min="0"
              max="1"
            />
          </FormField>
        </FormGroup>
        {SPAWNER_CATEGORIES.map((category) => (
          <SpawnerCategoryEditor
            key={category.key}
            label={category.label}
            entries={getSpawnerEntries(category.key)}
            onChange={(entries) => handleSpawnerChange(category.key, entries)}
          />
        ))}
      </Card>
    </div>
  );
}

function SpawnerCategoryEditor({ label, entries, onChange }) {
  const handleEntryChange = (index, patch) => {
    const next = entries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...entries, { ...defaultSpawnerEntry }]);
  };

  const handleRemove = (index) => {
    onChange(entries.filter((_, i) => i !== index));
  };

  const validateInt = (value, fieldName) => {
    if (!Number.isFinite(value) || !Number.isInteger(value)) return `${fieldName} must be an integer`;
    if (value < 0) return `${fieldName} must be at least 0`;
    return null;
  };

  return (
    <div className="biome-editor__spawner-category">
      <div className="biome-editor__spawner-header">
        <div className="biome-editor__spawner-header-left">
          <span className="biome-editor__spawner-title">{label}</span>
          <span className="biome-editor__spawner-count">{entries.length} entries</span>
        </div>
        <Button variant="secondary" size="sm" onClick={handleAdd}>
          Add Spawn
        </Button>
      </div>
      {entries.length === 0 ? (
        <div className="biome-editor__spawner-empty">
          No spawns configured yet. Add entries to define spawn weight and counts.
        </div>
      ) : (
        <>
          <div className="biome-editor__spawner-grid-header">
            <span>Entity</span>
            <span>Weight</span>
            <span>Min</span>
            <span>Max</span>
            <span className="biome-editor__spawner-actions-label">Actions</span>
          </div>
          {entries.map((entry, index) => {
            const maxCountError =
              entry.maxCount < entry.minCount ? 'Max must be >= Min' : validateInt(entry.maxCount, 'Max');

            return (
              <div key={index} className="biome-editor__spawner-row">
                <FormField
                  label="Entity"
                  horizontal={false}
                  error={entityTypeValidator(entry.type)}
                  className="biome-editor__spawner-field"
                >
                  <ResourceLocationInput
                    value={entry.type}
                    onChange={(val) => handleEntryChange(index, { type: val })}
                    registry="entity_type"
                    allowTags={false}
                    placeholder="minecraft:zombie"
                  />
                </FormField>
                <FormField
                  label="Weight"
                  horizontal={false}
                  error={validateInt(entry.weight, 'Weight')}
                  className="biome-editor__spawner-field"
                >
                  <Input
                    type="number"
                    value={entry.weight}
                    onChange={(e) =>
                      handleEntryChange(index, { weight: Number(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </FormField>
                <FormField
                  label="Min"
                  horizontal={false}
                  error={validateInt(entry.minCount, 'Min')}
                  className="biome-editor__spawner-field"
                >
                  <Input
                    type="number"
                    value={entry.minCount}
                    onChange={(e) =>
                      handleEntryChange(index, { minCount: Number(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </FormField>
                <FormField
                  label="Max"
                  horizontal={false}
                  error={maxCountError}
                  className="biome-editor__spawner-field"
                >
                  <Input
                    type="number"
                    value={entry.maxCount}
                    onChange={(e) =>
                      handleEntryChange(index, { maxCount: Number(e.target.value) || 0 })
                    }
                    min="0"
                  />
                </FormField>
                <div className="biome-editor__spawner-actions">
                  <Button variant="ghost" size="sm" onClick={() => {
                    const clone = JSON.parse(JSON.stringify(entries[index]));
                    onChange([...entries.slice(0, index + 1), clone, ...entries.slice(index + 1)]);
                  }}>
                    Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
