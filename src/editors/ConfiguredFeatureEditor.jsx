import React from 'react';
import { Card, FormField, FormGroup, Input, Checkbox, Button, EmptyState } from '../ui';
import {
  ResourceLocationInput,
  BlockStateEditor,
  RegistryTagInput,
  IntProviderEditor
} from '../components';

const FEATURE_TYPES = [
  'minecraft:ore',
  'minecraft:random_patch',
  'minecraft:simple_block',
  'minecraft:block_pile',
  'minecraft:spring_feature',
  'minecraft:lake',
  'minecraft:disk'
];

export function ConfiguredFeatureEditor({ value, onChange, id, onIdChange }) {
  const feature = value || {};
  const config = feature.config || {};

  const handleChange = (patch) => onChange({ ...feature, ...patch });
  const handleConfigChange = (patch) => handleChange({ config: { ...config, ...patch } });

  return (
    <div className="configured-feature-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Feature ID" help="Datapack registry name">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="configured_feature"
              allowTags={false}
              placeholder="minecraft:ore_diamond"
            />
          </FormField>
          <FormField label="Type">
            <ResourceLocationInput
              value={feature.type || ''}
              onChange={(val) => handleChange({ type: val, config: {} })}
              registry="feature_type"
              allowTags={false}
              placeholder="minecraft:ore"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Configuration" collapsible>
        {feature.type === 'minecraft:ore' && (
          <OreConfigEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:random_patch' && (
          <RandomPatchEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:simple_block' && (
          <SimpleBlockEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:block_pile' && (
          <BlockPileEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:spring_feature' && (
          <SpringFeatureEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:lake' && (
          <LakeEditor config={config} onChange={handleConfigChange} />
        )}
        {feature.type === 'minecraft:disk' && (
          <DiskEditor config={config} onChange={handleConfigChange} />
        )}
        {!FEATURE_TYPES.includes(feature.type) && (
          <EmptyState
            message="This feature type needs a custom editor."
            className="editor-placeholder"
          />
        )}
      </Card>
    </div>
  );
}

function OreConfigEditor({ config, onChange }) {
  const targets = config.targets || [];

  const handleTargetChange = (index, patch) => {
    const next = targets.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange({ ...config, targets: next });
  };

  const addTarget = () => {
    onChange({
      ...config,
      targets: [
        ...targets,
        {
          target: { predicate_type: 'minecraft:tag_match', tag: 'minecraft:stone_ore_replaceables' },
          state: { Name: 'minecraft:stone' }
        }
      ]
    });
  };

  return (
    <div className="configured-feature-editor__section">
      <FormGroup>
        <FormField label="Size">
          <Input
            type="number"
            min="0"
            value={config.size ?? 0}
            onChange={(e) => onChange({ ...config, size: Number(e.target.value) || 0 })}
          />
        </FormField>
        <FormField label="Discard Chance">
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={config.discard_chance_on_air_exposure ?? 0}
            onChange={(e) =>
              onChange({ ...config, discard_chance_on_air_exposure: Number(e.target.value) || 0 })
            }
          />
        </FormField>
      </FormGroup>

      <div className="editor-section-header">
        <span>Targets</span>
        <Button variant="secondary" size="sm" onClick={addTarget}>
          Add Target
        </Button>
      </div>

      {targets.map((target, index) => (
        <div key={index} className="configured-feature-editor__row">
          <FormField label="Target Tag" horizontal={false}>
            <ResourceLocationInput
              value={target.target?.tag || ''}
              onChange={(val) =>
                handleTargetChange(index, {
                  target: { predicate_type: 'minecraft:tag_match', tag: val }
                })
              }
              registry="block_tag"
              allowTags={true}
              placeholder="#minecraft:stone_ore_replaceables"
            />
          </FormField>
          <FormField label="Ore State" horizontal={false}>
            <BlockStateEditor
              value={target.state || { Name: '' }}
              onChange={(val) => handleTargetChange(index, { state: val })}
            />
          </FormField>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const clone = JSON.parse(JSON.stringify(target));
              onChange({ ...config, targets: [...targets.slice(0, index + 1), clone, ...targets.slice(index + 1)] });
            }}
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...config, targets: targets.filter((_, i) => i !== index) })}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function RandomPatchEditor({ config, onChange }) {
  const placement = config.feature?.placement || [];

  const handlePlacementChange = (index, patch) => {
    const next = placement.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    onChange({
      ...config,
      feature: {
        ...(config.feature || {}),
        placement: next
      }
    });
  };

  const addPlacement = () => {
    onChange({
      ...config,
      feature: {
        ...(config.feature || {}),
        placement: [...placement, { type: 'minecraft:count' }]
      }
    });
  };

  return (
    <div className="configured-feature-editor__section">
      <FormGroup>
        <FormField label="Feature">
          <ResourceLocationInput
            value={config.feature?.feature || ''}
            onChange={(val) =>
              onChange({ ...config, feature: { ...(config.feature || {}), feature: val, placement } })
            }
            registry="configured_feature"
            allowTags={false}
            placeholder="minecraft:patch_grass"
          />
        </FormField>
        <FormField label="Tries">
          <Input
            type="number"
            min="0"
            value={config.tries ?? 0}
            onChange={(e) => onChange({ ...config, tries: Number(e.target.value) || 0 })}
          />
        </FormField>
        <FormField label="XZ Spread">
          <Input
            type="number"
            min="0"
            value={config.xz_spread ?? 0}
            onChange={(e) => onChange({ ...config, xz_spread: Number(e.target.value) || 0 })}
          />
        </FormField>
        <FormField label="Y Spread">
          <Input
            type="number"
            min="0"
            value={config.y_spread ?? 0}
            onChange={(e) => onChange({ ...config, y_spread: Number(e.target.value) || 0 })}
          />
        </FormField>
      </FormGroup>

      <div className="editor-section-header">
        <span>Placement Modifiers</span>
        <Button variant="secondary" size="sm" onClick={addPlacement}>
          Add Modifier
        </Button>
      </div>
      {placement.map((entry, index) => (
        <div key={index} className="configured-feature-editor__row">
          <ResourceLocationInput
            value={entry.type || ''}
            onChange={(val) => handlePlacementChange(index, { type: val })}
            registry="placement_type"
            allowTags={false}
            placeholder="minecraft:block_predicate_filter"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const clone = JSON.parse(JSON.stringify(entry));
              onChange({
                ...config,
                feature: {
                  ...(config.feature || {}),
                  placement: [...placement.slice(0, index + 1), clone, ...placement.slice(index + 1)]
                }
              });
            }}
          >
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                ...config,
                feature: {
                  ...(config.feature || {}),
                  placement: placement.filter((_, i) => i !== index)
                }
              })
            }
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}

function SimpleBlockEditor({ config, onChange }) {
  const state = config.to_place?.state || { Name: '' };
  return (
    <FormGroup>
      <FormField label="Block State">
        <BlockStateEditor
          value={state}
          onChange={(val) =>
            onChange({
              ...config,
              to_place: { type: 'minecraft:simple_state_provider', state: val }
            })
          }
        />
      </FormField>
    </FormGroup>
  );
}

function BlockPileEditor({ config, onChange }) {
  const state = config.state_provider?.state || { Name: '' };
  return (
    <FormGroup>
      <FormField label="Block State">
        <BlockStateEditor
          value={state}
          onChange={(val) =>
            onChange({
              ...config,
              state_provider: { type: 'minecraft:simple_state_provider', state: val }
            })
          }
        />
      </FormField>
    </FormGroup>
  );
}

function SpringFeatureEditor({ config, onChange }) {
  return (
    <FormGroup>
      <FormField label="State">
        <BlockStateEditor
          value={config.state || { Name: '' }}
          onChange={(val) => onChange({ ...config, state: val })}
        />
      </FormField>
      <FormField label="Rock Count">
        <Input
          type="number"
          min="0"
          value={config.rock_count ?? 0}
          onChange={(e) => onChange({ ...config, rock_count: Number(e.target.value) || 0 })}
        />
      </FormField>
      <FormField label="Hole Count">
        <Input
          type="number"
          min="0"
          value={config.hole_count ?? 0}
          onChange={(e) => onChange({ ...config, hole_count: Number(e.target.value) || 0 })}
        />
      </FormField>
      <FormField label="Requires Block Below">
        <Checkbox
          checked={Boolean(config.requires_block_below)}
          onChange={(e) => onChange({ ...config, requires_block_below: e.target.checked })}
        />
      </FormField>
      <FormField label="Valid Blocks">
        <RegistryTagInput
          values={config.valid_blocks || []}
          onChange={(vals) => onChange({ ...config, valid_blocks: vals })}
          registry="block"
          allowTags={false}
          placeholder="Add block..."
        />
      </FormField>
    </FormGroup>
  );
}

function LakeEditor({ config, onChange }) {
  const fluidState = config.fluid?.state || { Name: '' };
  const barrierState = config.barrier?.state || { Name: '' };
  return (
    <FormGroup>
      <FormField label="Fluid">
        <BlockStateEditor
          value={fluidState}
          onChange={(val) =>
            onChange({ ...config, fluid: { type: 'minecraft:simple_state_provider', state: val } })
          }
        />
      </FormField>
      <FormField label="Barrier">
        <BlockStateEditor
          value={barrierState}
          onChange={(val) =>
            onChange({ ...config, barrier: { type: 'minecraft:simple_state_provider', state: val } })
          }
        />
      </FormField>
    </FormGroup>
  );
}

function DiskEditor({ config, onChange }) {
  const state = config.state_provider?.state || { Name: '' };
  return (
    <div className="configured-feature-editor__section">
      <FormGroup>
        <FormField label="Half Height">
          <Input
            type="number"
            min="0"
            value={config.half_height ?? 1}
            onChange={(e) => onChange({ ...config, half_height: Number(e.target.value) || 0 })}
          />
        </FormField>
        <IntProviderEditor
          value={config.radius || 0}
          onChange={(val) => onChange({ ...config, radius: val })}
          label="Radius"
        />
        <FormField label="Target Blocks">
          <RegistryTagInput
            values={config.target?.blocks || []}
            onChange={(vals) =>
              onChange({ ...config, target: { type: 'minecraft:matching_blocks', blocks: vals } })
            }
            registry="block"
            allowTags={false}
            placeholder="Add block..."
          />
        </FormField>
        <FormField label="State Provider">
          <BlockStateEditor
            value={state}
            onChange={(val) =>
              onChange({ ...config, state_provider: { type: 'minecraft:simple_state_provider', state: val } })
            }
          />
        </FormField>
      </FormGroup>
    </div>
  );
}
