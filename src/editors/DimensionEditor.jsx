import React, { useCallback, useMemo, useRef, useState, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button, Card, FormField, FormGroup, Input, Select } from '../ui';
import { ResourceLocationInput, RegistryTagInput } from '../components';

const NOISE_PARAMS = ['temperature', 'humidity', 'continentalness', 'erosion', 'weirdness', 'depth', 'offset'];
const SCALABLE_PARAMS = ['temperature', 'humidity', 'continentalness', 'erosion', 'weirdness', 'depth'];

const MAX_SPAN = 4; // noise space is roughly -2 to 2

function getParamSpan(value) {
  if (Array.isArray(value)) return Math.abs(value[1] - value[0]);
  return 0;
}

function computeBiomeSize(params) {
  let totalSpan = 0;
  let rangeCount = 0;
  for (const key of SCALABLE_PARAMS) {
    const v = params[key];
    if (v != null) {
      totalSpan += getParamSpan(v);
      rangeCount++;
    }
  }
  const avgSpan = rangeCount > 0 ? totalSpan / rangeCount : 0;
  const offset = typeof params.offset === 'number' ? params.offset : 0;
  // Combine: range contribution (70%) + offset contribution (30%)
  const rangeScore = Math.min(avgSpan / MAX_SPAN, 1);
  const offsetScore = Math.min(Math.max(offset, 0), 1);
  const score = rangeScore * 0.7 + offsetScore * 0.3;
  return Math.max(1, Math.min(10, Math.round(1 + score * 9)));
}

function applyBiomeSize(params, targetSize) {
  const currentSize = computeBiomeSize(params);
  if (currentSize === targetSize) return params;

  // Target score from size (1-10 → 0-1)
  const targetScore = (targetSize - 1) / 9;
  const targetRangeScore = Math.min(targetScore / 0.7, 1); // allocate to ranges first
  const targetAvgSpan = targetRangeScore * MAX_SPAN;

  const newParams = { ...params };

  // Scale each range param to achieve the target average span
  for (const key of SCALABLE_PARAMS) {
    const v = params[key];
    if (v == null) continue;
    if (Array.isArray(v)) {
      const currentSpan = Math.abs(v[1] - v[0]);
      const mid = (v[0] + v[1]) / 2;
      const newHalf = (currentSpan > 0.001 ? targetAvgSpan : targetAvgSpan) / 2;
      // Scale proportionally but keep center
      const factor = currentSpan > 0.001 ? targetAvgSpan / currentSpan : 1;
      const scaledHalf = currentSpan > 0.001 ? (currentSpan / 2) * factor : newHalf;
      newParams[key] = [
        Math.round((mid - scaledHalf) * 1000) / 1000,
        Math.round((mid + scaledHalf) * 1000) / 1000
      ];
    }
  }

  // Adjust offset: remaining score goes to offset
  const remainingScore = Math.max(0, targetScore - targetRangeScore * 0.7);
  const targetOffset = Math.min(1, remainingScore / 0.3);
  newParams.offset = Math.round(targetOffset * 1000) / 1000;

  return newParams;
}

function NoiseParamInput({ label, value, onChange }) {
  const isRange = Array.isArray(value);
  const min = isRange ? value[0] : (value ?? 0);
  const max = isRange ? value[1] : (value ?? 0);

  return (
    <div className="noise-param">
      <label className="noise-param__label">{label}</label>
      <Input
        type="number"
        step="0.05"
        value={min}
        onChange={(e) => {
          const v = parseFloat(e.target.value) || 0;
          onChange(isRange ? [v, max] : v);
        }}
        className="noise-param__input"
      />
      {isRange && (
        <>
          <span className="noise-param__sep">–</span>
          <Input
            type="number"
            step="0.05"
            value={max}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 0;
              onChange([min, v]);
            }}
            className="noise-param__input"
          />
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange(isRange ? min : [min, min])}
        title={isRange ? 'Switch to single value' : 'Switch to range'}
      >
        {isRange ? '1' : '↔'}
      </Button>
    </div>
  );
}

const BiomeRow = memo(function BiomeRow({ entry, onChangeBiome, onChangeEntry, onDuplicate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const biomeName = typeof entry === 'string' ? entry : entry.biome;
  const params = typeof entry === 'object' ? (entry.parameters || {}) : {};

  return (
    <div className={`multi-noise-biome-entry${expanded ? ' multi-noise-biome-entry--expanded' : ''}`}>
      <div className="multi-noise-biome-entry__header">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          title={expanded ? 'Collapse' : 'Expand parameters'}
          className="multi-noise-biome-entry__expand"
        >
          {expanded ? '▾' : '▸'}
        </Button>
        <ResourceLocationInput
          value={biomeName || ''}
          onChange={onChangeBiome}
          registry="biome"
          allowTags={false}
        />
        <Button variant="ghost" size="sm" onClick={onDuplicate} title="Duplicate biome">⧉</Button>
        <Button variant="ghost" size="sm" onClick={onRemove} title="Remove biome">×</Button>
      </div>
      {expanded && typeof entry === 'object' && (
        <div className="multi-noise-biome-entry__detail">
          <div className="multi-noise-biome-entry__size">
            <label className="noise-param__label">Biome Size</label>
            <span className="multi-noise-biome-entry__size-value">{computeBiomeSize(params)}</span>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={computeBiomeSize(params)}
              onChange={(e) => onChangeEntry({ ...entry, parameters: applyBiomeSize(params, Number(e.target.value)) })}
              className="multi-noise-biome-entry__size-slider"
            />
            <span className="multi-noise-biome-entry__size-hint">1 = klein, 10 = groß</span>
          </div>
          <div className="multi-noise-biome-entry__params">
            {NOISE_PARAMS.map((param) => (
              <NoiseParamInput
                key={param}
                label={param}
                value={params[param] ?? 0}
                onChange={(val) => onChangeEntry({ ...entry, parameters: { ...params, [param]: val } })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

const BIOME_ROW_HEIGHT = 40;

function BiomeSortedList({ biomes, onBiomesChange }) {
  const parentRef = useRef(null);
  const [filter, setFilter] = useState('');

  const sortedIndices = useMemo(() => {
    const indices = biomes.map((_, idx) => idx).sort((a, b) => {
      const nameA = (typeof biomes[a] === 'string' ? biomes[a] : biomes[a].biome) || '';
      const nameB = (typeof biomes[b] === 'string' ? biomes[b] : biomes[b].biome) || '';
      return nameA.localeCompare(nameB);
    });
    if (!filter) return indices;
    const lower = filter.toLowerCase();
    return indices.filter((idx) => {
      const name = (typeof biomes[idx] === 'string' ? biomes[idx] : biomes[idx].biome) || '';
      return name.toLowerCase().includes(lower);
    });
  }, [biomes, filter]);

  const virtualizer = useVirtualizer({
    count: sortedIndices.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => BIOME_ROW_HEIGHT,
    overscan: 10,
  });

  const handleChangeBiome = useCallback((idx, val) => {
    const newBiomes = [...biomes];
    const entry = biomes[idx];
    if (typeof entry === 'string') {
      newBiomes[idx] = val;
    } else {
      newBiomes[idx] = { ...entry, biome: val };
    }
    onBiomesChange(newBiomes);
  }, [biomes, onBiomesChange]);

  const handleChangeEntry = useCallback((idx, newEntry) => {
    const newBiomes = [...biomes];
    newBiomes[idx] = newEntry;
    onBiomesChange(newBiomes);
  }, [biomes, onBiomesChange]);

  const handleDuplicate = useCallback((idx) => {
    const clone = JSON.parse(JSON.stringify(biomes[idx]));
    onBiomesChange([...biomes.slice(0, idx + 1), clone, ...biomes.slice(idx + 1)]);
  }, [biomes, onBiomesChange]);

  const handleRemove = useCallback((idx) => {
    onBiomesChange(biomes.filter((_, i) => i !== idx));
  }, [biomes, onBiomesChange]);

  return (
    <div className="multi-noise-biomes-list">
      {biomes.length > 50 && (
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter biomes..."
          className="multi-noise-biomes-list__filter"
        />
      )}
      <div
        ref={parentRef}
        className="multi-noise-biomes-list__scroll"
        style={{ height: Math.min(sortedIndices.length * BIOME_ROW_HEIGHT, 500), overflow: 'auto' }}
      >
        <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const idx = sortedIndices[virtualRow.index];
            return (
              <div
                key={idx}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <BiomeRow
                  entry={biomes[idx]}
                  onChangeBiome={(val) => handleChangeBiome(idx, val)}
                  onChangeEntry={(newEntry) => handleChangeEntry(idx, newEntry)}
                  onDuplicate={() => handleDuplicate(idx)}
                  onRemove={() => handleRemove(idx)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
                <>
                  <FormField label="Preset" hint="Use a preset OR define biomes manually below">
                    <ResourceLocationInput
                      value={biomeSource.preset || ''}
                      onChange={(val) => handleBiomeSourceChange({ preset: val })}
                      registry="multi_noise_preset"
                      allowTags={false}
                      allowEmpty
                      placeholder="minecraft:overworld"
                    />
                  </FormField>
                  <FormField label={`Biomes${biomeSource.biomes?.length ? ` (${biomeSource.biomes.length})` : ''}`}>
                    {biomeSource.biomes && biomeSource.biomes.length > 0 && (
                      <BiomeSortedList biomes={biomeSource.biomes} onBiomesChange={(newBiomes) => handleBiomeSourceChange({ biomes: newBiomes })} />
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        const newBiome = {
                          biome: 'minecraft:plains',
                          parameters: {
                            temperature: 0,
                            humidity: 0,
                            continentalness: 0,
                            erosion: 0,
                            weirdness: 0,
                            depth: 0,
                            offset: 0
                          }
                        };
                        const newBiomes = [...(biomeSource.biomes || []), newBiome];
                        handleBiomeSourceChange({ biomes: newBiomes });
                      }}
                    >
                      Add Biome
                    </Button>
                  </FormField>
                </>
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
