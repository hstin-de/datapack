import React from 'react';
import { Card, FormField, FormGroup, Input, Select, Button } from '../ui';
import { ResourceLocationInput, TagReferenceInput } from '../components';

export function StructureSetEditor({ value, onChange, id, onIdChange }) {
  const structureSet = value || { structures: [], placement: { type: 'minecraft:random_spread' } };
  const placement = structureSet.placement || { type: 'minecraft:random_spread' };

  const handleChange = (patch) => onChange({ ...structureSet, ...patch });
  const handlePlacementChange = (patch) => handleChange({ placement: { ...placement, ...patch } });

  const handleStructureChange = (index, patch) => {
    const next = structureSet.structures.map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    handleChange({ structures: next });
  };

  return (
    <div className="structure-set-editor">
      <Card title="Identity" collapsible>
        <FormGroup>
          <FormField label="Structure Set ID">
            <ResourceLocationInput
              value={id || ''}
              onChange={onIdChange}
              registry="structure_set"
              allowTags={false}
              placeholder="minecraft:strongholds"
            />
          </FormField>
        </FormGroup>
      </Card>

      <Card title="Structures" collapsible>
        <div className="editor-section-header">
          <span>Structure List</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              handleChange({
                structures: [...(structureSet.structures || []), { structure: 'minecraft:stronghold', weight: 1 }]
              })
            }
          >
            Add Structure
          </Button>
        </div>
        {(structureSet.structures || []).map((entry, index) => (
          <div key={index} className="structure-set-editor__row">
            <ResourceLocationInput
              value={entry.structure || ''}
              onChange={(val) => handleStructureChange(index, { structure: val })}
              registry="structure"
              allowTags={false}
              placeholder="minecraft:stronghold"
            />
            <Input
              type="number"
              min="1"
              value={entry.weight ?? 1}
              onChange={(e) => handleStructureChange(index, { weight: Number(e.target.value) || 1 })}
            />
            <Button variant="ghost" size="sm" onClick={() => handleChange({ structures: structureSet.structures.filter((_, i) => i !== index) })}>
              Remove
            </Button>
          </div>
        ))}
      </Card>

      <Card title="Placement" collapsible>
        <FormGroup>
          <FormField label="Type">
            <Select
              value={placement.type || 'minecraft:random_spread'}
              onChange={(e) => handlePlacementChange({ type: e.target.value })}
            >
              <option value="minecraft:random_spread">minecraft:random_spread</option>
              <option value="minecraft:concentric_rings">minecraft:concentric_rings</option>
            </Select>
          </FormField>

          {placement.type === 'minecraft:random_spread' && (
            <>
              <FormField label="Spacing">
                <Input
                  type="number"
                  min="1"
                  value={placement.spacing ?? 1}
                  onChange={(e) => handlePlacementChange({ spacing: Number(e.target.value) || 1 })}
                />
              </FormField>
              <FormField label="Separation">
                <Input
                  type="number"
                  min="0"
                  value={placement.separation ?? 0}
                  onChange={(e) => handlePlacementChange({ separation: Number(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Salt">
                <Input
                  type="number"
                  value={placement.salt ?? 0}
                  onChange={(e) => handlePlacementChange({ salt: Number(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Spread Type">
                <Select
                  value={placement.spread_type || 'linear'}
                  onChange={(e) => handlePlacementChange({ spread_type: e.target.value })}
                >
                  <option value="linear">linear</option>
                  <option value="triangular">triangular</option>
                </Select>
              </FormField>
              <FormField label="Frequency">
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={placement.frequency ?? 0}
                  onChange={(e) => handlePlacementChange({ frequency: Number(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Frequency Reduction">
                <Select
                  value={placement.frequency_reduction_method || 'default'}
                  onChange={(e) => handlePlacementChange({ frequency_reduction_method: e.target.value })}
                >
                  <option value="default">default</option>
                  <option value="legacy_type_1">legacy_type_1</option>
                  <option value="legacy_type_2">legacy_type_2</option>
                  <option value="legacy_type_3">legacy_type_3</option>
                </Select>
              </FormField>
              <FormField label="Exclusion Other Set">
                <ResourceLocationInput
                  value={placement.exclusion_zone?.other_set || ''}
                  onChange={(val) =>
                    handlePlacementChange({ exclusion_zone: { ...placement.exclusion_zone, other_set: val } })
                  }
                  registry="structure_set"
                  allowTags={false}
                  placeholder="minecraft:villages"
                />
              </FormField>
              <FormField label="Exclusion Chunk Count">
                <Input
                  type="number"
                  min="1"
                  value={placement.exclusion_zone?.chunk_count ?? 1}
                  onChange={(e) =>
                    handlePlacementChange({ exclusion_zone: { ...placement.exclusion_zone, chunk_count: Number(e.target.value) || 1 } })
                  }
                />
              </FormField>
            </>
          )}

          {placement.type === 'minecraft:concentric_rings' && (
            <>
              <FormField label="Distance">
                <Input
                  type="number"
                  min="0"
                  value={placement.distance ?? 0}
                  onChange={(e) => handlePlacementChange({ distance: Number(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Spread">
                <Input
                  type="number"
                  min="0"
                  value={placement.spread ?? 0}
                  onChange={(e) => handlePlacementChange({ spread: Number(e.target.value) || 0 })}
                />
              </FormField>
              <FormField label="Count">
                <Input
                  type="number"
                  min="1"
                  value={placement.count ?? 1}
                  onChange={(e) => handlePlacementChange({ count: Number(e.target.value) || 1 })}
                />
              </FormField>
              <FormField label="Preferred Biomes">
                <TagReferenceInput
                  value={placement.preferred_biomes || ''}
                  onChange={(val) => handlePlacementChange({ preferred_biomes: val })}
                  registry="biome_tag"
                  placeholder="#minecraft:stronghold_biased_to"
                />
              </FormField>
            </>
          )}
        </FormGroup>
      </Card>
    </div>
  );
}
