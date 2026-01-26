import React, { useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Download, Upload } from 'lucide-react';
import { BiomeEditor } from './editors/BiomeEditor.jsx';
import { ConfiguredFeatureEditor } from './editors/ConfiguredFeatureEditor.jsx';
import { PlacedFeatureEditor } from './editors/PlacedFeatureEditor.jsx';
import { ConfiguredCarverEditor } from './editors/ConfiguredCarverEditor.jsx';
import { StructureEditor } from './editors/StructureEditor.jsx';
import { StructureSetEditor } from './editors/StructureSetEditor.jsx';
import { TemplatePoolEditor } from './editors/TemplatePoolEditor.jsx';
import { ProcessorListEditor } from './editors/ProcessorListEditor.jsx';
import { NoiseSettingsEditor } from './editors/NoiseSettingsEditor.jsx';
import { DensityFunctionEditor } from './editors/DensityFunctionEditor.jsx';
import { NoiseEditor } from './editors/NoiseEditor.jsx';
import { DimensionEditor } from './editors/DimensionEditor.jsx';
import { WorldPresetEditor } from './editors/WorldPresetEditor.jsx';
import { FlatLevelGeneratorPresetEditor } from './editors/FlatLevelGeneratorPresetEditor.jsx';
import { TagEditor } from './editors/TagEditor.jsx';
import { PackMcmetaEditor } from './editors/PackMcmetaEditor.jsx';
import {
  Badge,
  Button,
  Card,
  FormField,
  Input,
  MasterDetailLayout,
  TabPanel
} from './ui';
import {
  validateBiome,
  validateConfiguredFeature,
  validatePlacedFeature,
  validateConfiguredCarver,
  validateStructure,
  validateStructureSet,
  validateTemplatePool,
  validateProcessorList,
  validateNoiseSettings,
  validateDensityFunction,
  validateNoise,
  validateDimension,
  validateWorldPreset,
  validateFlatLevelGeneratorPreset,
  validateTag
} from './utils/validation.js';
import './App.css';

const createDefaultBiome = () => ({
  temperature: 0.8,
  downfall: 0.4,
  has_precipitation: true,
  effects: {
    fog_color: 12638463,
    water_color: 4159204,
    water_fog_color: 329011,
    sky_color: 7907327
  },
  spawners: {
    monster: [],
    creature: [],
    ambient: [],
    axolotls: [],
    underground_water_creature: [],
    water_creature: [],
    water_ambient: [],
    misc: []
  },
  spawn_costs: {},
  carvers: [],
  features: Array.from({ length: 11 }, () => [])
});

const createDefaultConfiguredFeature = () => ({
  type: 'minecraft:ore',
  config: {}
});

const createDefaultPlacedFeature = () => ({
  feature: 'minecraft:ore_diamond',
  placement: []
});

const createDefaultConfiguredCarver = () => ({
  type: 'minecraft:cave',
  config: {
    probability: 0.1,
    y: { type: 'minecraft:uniform', min_inclusive: { absolute: 0 }, max_inclusive: { absolute: 64 } },
    yScale: 1.0,
    lava_level: { absolute: 10 },
    replaceable: '#minecraft:overworld_carver_replaceables'
  }
});

const createDefaultStructure = () => ({
  type: 'minecraft:jigsaw',
  biomes: '#minecraft:is_overworld',
  step: 'underground_structures',
  spawn_overrides: {},
  start_pool: 'minecraft:village/plains/town_centers',
  size: 7,
  start_height: { absolute: 0 }
});

const createDefaultStructureSet = () => ({
  structures: [{ structure: 'minecraft:stronghold', weight: 1 }],
  placement: { type: 'minecraft:random_spread', spacing: 32, separation: 8, salt: 0 }
});

const createDefaultTemplatePool = () => ({
  fallback: 'minecraft:empty',
  elements: []
});

const createDefaultProcessorList = () => ({
  processors: []
});

const createDefaultNoiseSettings = () => ({
  default_block: { Name: 'minecraft:stone' },
  default_fluid: { Name: 'minecraft:water' },
  sea_level: 63,
  disable_mob_generation: false,
  aquifers_enabled: true,
  ore_veins_enabled: true,
  legacy_random_source: false,
  noise: {
    min_y: -64,
    height: 384,
    size_horizontal: 1,
    size_vertical: 2
  },
  noise_router: {}
});

const createDefaultDensityFunction = () => ({
  type: 'minecraft:constant',
  argument: 'minecraft:overworld/continents'
});

const createDefaultNoise = () => ({
  firstOctave: -7,
  amplitudes: [1, 1]
});

const createDefaultDimension = () => ({
  type: 'minecraft:overworld',
  generator: {
    type: 'minecraft:noise',
    biome_source: { type: 'minecraft:multi_noise', preset: 'minecraft:overworld' },
    settings: 'minecraft:overworld'
  }
});

const createDefaultWorldPreset = () => ({
  dimensions: {
    'minecraft:overworld': {
      type: 'minecraft:overworld',
      generator: {
        type: 'minecraft:noise',
        biome_source: { type: 'minecraft:multi_noise', preset: 'minecraft:overworld' },
        settings: 'minecraft:overworld'
      }
    }
  }
});

const createDefaultFlatPreset = () => ({
  display: 'minecraft:grass_block',
  settings: {
    biome: 'minecraft:plains',
    features: false,
    lakes: false,
    layers: [
      { block: 'minecraft:bedrock', height: 1 },
      { block: 'minecraft:dirt', height: 2 },
      { block: 'minecraft:grass_block', height: 1 }
    ],
    structure_overrides: []
  }
});

const createDefaultTag = () => ({
  replace: false,
  values: []
});

const createDefaultPackMcmeta = () => ({
  pack: {
    pack_format: 0,
    description: ''
  }
});

const editorGroups = [
  {
    label: 'Datapack',
    items: [{ id: 'metadata', label: 'Metadata' }]
  },
  {
    label: 'Core Worldgen',
    items: [
      { id: 'biome', label: 'Biomes' },
      { id: 'configured_feature', label: 'Configured Features' },
      { id: 'placed_feature', label: 'Placed Features' },
      { id: 'configured_carver', label: 'Configured Carvers' }
    ]
  },
  {
    label: 'Tags',
    items: [{ id: 'tag', label: 'Tags' }]
  },
  {
    label: 'Structures',
    items: [
      { id: 'structure', label: 'Structures' },
      { id: 'structure_set', label: 'Structure Sets' },
      { id: 'template_pool', label: 'Template Pools' },
      { id: 'processor_list', label: 'Processor Lists' }
    ]
  },
  {
    label: 'Noise & Density',
    items: [
      { id: 'noise_settings', label: 'Noise Settings' },
      { id: 'density_function', label: 'Density Functions' },
      { id: 'noise', label: 'Noise' }
    ]
  },
  {
    label: 'Dimensions & Presets',
    items: [
      { id: 'dimension', label: 'Dimensions' },
      { id: 'world_preset', label: 'World Presets' },
      { id: 'flat_level_generator_preset', label: 'Flat Presets' }
    ]
  }
];

const labelMap = {
  metadata: 'Metadata',
  biome: 'Biome',
  configured_feature: 'Configured Feature',
  placed_feature: 'Placed Feature',
  configured_carver: 'Configured Carver',
  structure: 'Structure',
  structure_set: 'Structure Set',
  template_pool: 'Template Pool',
  processor_list: 'Processor List',
  noise_settings: 'Noise Settings',
  density_function: 'Density Function',
  noise: 'Noise',
  dimension: 'Dimension',
  world_preset: 'World Preset',
  flat_level_generator_preset: 'Flat Preset',
  tag: 'Tag'
};

const WORLDGEN_TYPES = [
  'biome',
  'configured_feature',
  'placed_feature',
  'configured_carver',
  'structure',
  'structure_set',
  'template_pool',
  'processor_list',
  'noise_settings',
  'density_function',
  'noise',
  'dimension',
  'world_preset',
  'flat_level_generator_preset'
];

const DATAPACK_FILE_PATTERN = /^data\/([^/]+)\/worldgen\/([^/]+)\/(.+)\.json$/;
const DATAPACK_TAG_PATTERN = /^data\/([^/]+)\/tags\/(.+)\.json$/;

const createEmptyImport = () =>
  Object.fromEntries(WORLDGEN_TYPES.map((type) => [type, []]));

const sanitizeFilename = (value) => value.replace(/[^a-z0-9._-]+/gi, '_');

const splitResourceLocation = (value, fallbackNamespace = '') => {
  if (!value) return { namespace: fallbackNamespace, path: '', hasNamespace: false };
  const clean = value.startsWith('#') ? value.slice(1) : value;
  const colonIndex = clean.indexOf(':');
  if (colonIndex === -1) {
    return { namespace: fallbackNamespace, path: clean, hasNamespace: false };
  }
  return {
    namespace: clean.slice(0, colonIndex),
    path: clean.slice(colonIndex + 1),
    hasNamespace: true
  };
};

const extractPackMeta = async (zip) => {
  const packMetaEntry = zip.file('pack.mcmeta');
  if (!packMetaEntry) return null;
  try {
    const contents = await packMetaEntry.async('string');
    const data = JSON.parse(contents);
    const pack = data.pack || {};
    const description =
      typeof pack.description === 'string' ? pack.description : JSON.stringify(pack.description || '');
    return {
      description,
      packFormat: pack.pack_format != null ? String(pack.pack_format) : '',
      raw: data
    };
  } catch (error) {
    return { description: '', packFormat: '', error: error?.message || String(error) };
  }
};

const parseDatapackZip = async (file) => {
  const zip = await JSZip.loadAsync(file);
  const entriesByType = createEmptyImport();
  const errors = [];
  const namespaceCounts = new Map();
  const tagEntries = [];

  await Promise.all(
    Object.values(zip.files).map(async (zipEntry) => {
      if (zipEntry.dir) return;
      if (zipEntry.name === 'pack.mcmeta') return;
      const tagMatch = zipEntry.name.match(DATAPACK_TAG_PATTERN);
      if (tagMatch) {
        const [, namespace, path] = tagMatch;
        namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          const data = JSON.parse(contents);
          tagEntries.push({ id: `${namespace}:${path}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }
      const match = zipEntry.name.match(DATAPACK_FILE_PATTERN);
      if (match) {
        const [, namespace, type, path] = match;
        if (entriesByType[type]) {
          namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
          try {
            const contents = await zipEntry.async('string');
            const data = JSON.parse(contents);
            entriesByType[type].push({ id: `${namespace}:${path}`, data });
            return;
          } catch (error) {
            errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
            return;
          }
        }
      }
    })
  );

  WORLDGEN_TYPES.forEach((type) => {
    entriesByType[type].sort((a, b) => a.id.localeCompare(b.id));
  });

  tagEntries.sort((a, b) => a.id.localeCompare(b.id));
  const totalWorldgen = WORLDGEN_TYPES.reduce((sum, type) => sum + entriesByType[type].length, 0);
  const total = totalWorldgen + tagEntries.length;
  const packMeta = await extractPackMeta(zip);
  const namespaces = Array.from(namespaceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([namespace]) => namespace);
  return { entriesByType, total, errors, namespaces, packMeta, tagEntries };
};

const makeUniqueId = (base, list) => {
  const getIdKey = (value) => {
    const { namespace, path, hasNamespace } = splitResourceLocation(value);
    return hasNamespace ? `${namespace}:${path}` : path || value;
  };
  const baseKey = getIdKey(base);
  let candidate = baseKey;
  if (!list.some((item) => getIdKey(item.id) === candidate)) {
    return candidate;
  }
  let index = 2;
  while (list.some((item) => getIdKey(item.id) === `${baseKey}_${index}`)) {
    index += 1;
  }
  return `${baseKey}_${index}`;
};

const updateItem = (list, index, patch) =>
  list.map((item, i) => (i === index ? { ...item, ...patch } : item));

export default function App() {
  const [activeEditor, setActiveEditor] = useState('biome');

  const [biomes, setBiomes] = useState([]);
  const [selectedBiome, setSelectedBiome] = useState(null);

  const [configuredFeatures, setConfiguredFeatures] = useState([]);
  const [selectedConfiguredFeature, setSelectedConfiguredFeature] = useState(null);

  const [placedFeatures, setPlacedFeatures] = useState([]);
  const [selectedPlacedFeature, setSelectedPlacedFeature] = useState(null);

  const [configuredCarvers, setConfiguredCarvers] = useState([]);
  const [selectedConfiguredCarver, setSelectedConfiguredCarver] = useState(null);

  const [structures, setStructures] = useState([]);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const [structureSets, setStructureSets] = useState([]);
  const [selectedStructureSet, setSelectedStructureSet] = useState(null);

  const [templatePools, setTemplatePools] = useState([]);
  const [selectedTemplatePool, setSelectedTemplatePool] = useState(null);

  const [processorLists, setProcessorLists] = useState([]);
  const [selectedProcessorList, setSelectedProcessorList] = useState(null);

  const [noiseSettingsList, setNoiseSettingsList] = useState([]);
  const [selectedNoiseSettings, setSelectedNoiseSettings] = useState(null);

  const [densityFunctions, setDensityFunctions] = useState([]);
  const [selectedDensityFunction, setSelectedDensityFunction] = useState(null);

  const [noises, setNoises] = useState([]);
  const [selectedNoise, setSelectedNoise] = useState(null);

  const [dimensions, setDimensions] = useState([]);
  const [selectedDimension, setSelectedDimension] = useState(null);

  const [worldPresets, setWorldPresets] = useState([]);
  const [selectedWorldPreset, setSelectedWorldPreset] = useState(null);

  const [flatPresets, setFlatPresets] = useState([]);
  const [selectedFlatPreset, setSelectedFlatPreset] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [packMeta, setPackMeta] = useState({
    namespace: ''
  });
  const [packMcmeta, setPackMcmeta] = useState(createDefaultPackMcmeta());
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  const getActiveEntry = () => {
    switch (activeEditor) {
      case 'configured_feature':
        return configuredFeatures[selectedConfiguredFeature] || null;
      case 'placed_feature':
        return placedFeatures[selectedPlacedFeature] || null;
      case 'configured_carver':
        return configuredCarvers[selectedConfiguredCarver] || null;
      case 'structure':
        return structures[selectedStructure] || null;
      case 'structure_set':
        return structureSets[selectedStructureSet] || null;
      case 'template_pool':
        return templatePools[selectedTemplatePool] || null;
      case 'processor_list':
        return processorLists[selectedProcessorList] || null;
      case 'noise_settings':
        return noiseSettingsList[selectedNoiseSettings] || null;
      case 'density_function':
        return densityFunctions[selectedDensityFunction] || null;
      case 'noise':
        return noises[selectedNoise] || null;
      case 'dimension':
        return dimensions[selectedDimension] || null;
      case 'world_preset':
        return worldPresets[selectedWorldPreset] || null;
      case 'flat_level_generator_preset':
        return flatPresets[selectedFlatPreset] || null;
      case 'tag':
        return tags[selectedTag] || null;
      default:
        return biomes[selectedBiome] || null;
    }
  };

  const activeEntry = getActiveEntry();

  const validation = useMemo(() => {
    if (!activeEntry) return { valid: true, errors: [] };
    const data = activeEntry.data;
    switch (activeEditor) {
      case 'configured_feature':
        return validateConfiguredFeature(data);
      case 'placed_feature':
        return validatePlacedFeature(data);
      case 'configured_carver':
        return validateConfiguredCarver(data);
      case 'structure':
        return validateStructure(data);
      case 'structure_set':
        return validateStructureSet(data);
      case 'template_pool':
        return validateTemplatePool(data);
      case 'processor_list':
        return validateProcessorList(data);
      case 'noise_settings':
        return validateNoiseSettings(data);
      case 'density_function':
        return validateDensityFunction(data);
      case 'noise':
        return validateNoise(data);
      case 'dimension':
        return validateDimension(data);
      case 'world_preset':
        return validateWorldPreset(data);
      case 'flat_level_generator_preset':
        return validateFlatLevelGeneratorPreset(data);
      case 'tag':
        return validateTag(data);
      default:
        return validateBiome(data);
    }
  }, [activeEditor, activeEntry]);

  const validationErrors = validation.errors || [];
  const validationContextLabel = labelMap[activeEditor] || 'Biome';
  const validationStatusLabel = validation.valid ? 'Valid' : `${validationErrors.length} Issues`;
  const validationActionLabel = validation.valid ? 'Details' : 'Issues';

  const renderCollection = ({
    title,
    items,
    selectedIndex,
    setSelectedIndex,
    setItems,
    defaultId,
    defaultData,
    renderEditor
  }) => (
    <MasterDetailLayout
      title={title}
      items={items}
      selectedIndex={selectedIndex}
      onSelect={setSelectedIndex}
      onAdd={() => {
        setItems((prev) => {
          const nextId = makeUniqueId(defaultId, prev);
          const next = [...prev, { id: nextId, data: defaultData() }];
          setSelectedIndex(next.length - 1);
          return next;
        });
      }}
      onRemove={(index) => {
        setItems((prev) => {
          const next = prev.filter((_, i) => i !== index);
          if (next.length === 0) {
            setSelectedIndex(null);
          } else {
            setSelectedIndex(Math.min(index, next.length - 1));
          }
          return next;
        });
      }}
      renderItem={(item) => (item.id ? toDisplayId(item.id) : 'Unnamed')}
    >
      <div className="editor-stack">
        <details className="validation-card">
          <summary className="validation-card__summary">
            <div className="validation-card__left">
              <span className="validation-card__title">Validation</span>
              <span className="validation-card__context">{validationContextLabel}</span>
              <Badge variant={validation.valid ? 'success' : 'error'}>{validationStatusLabel}</Badge>
            </div>
            <span className="validation-card__action">{validationActionLabel}</span>
          </summary>
          <div className="validation-card__body">
            {validation.valid ? (
              <p className="validation-card__empty">No validation errors detected.</p>
            ) : (
              <ul className="validation-card__list">
                {validationErrors.map((err, index) => (
                  <li key={`${err.path}-${index}`} className="validation-card__item">
                    <span className="validation-card__path">{err.path || '/'}</span>
                    <span className="validation-card__message">{err.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </details>
        {items[selectedIndex] && renderEditor(items[selectedIndex], selectedIndex)}
      </div>
    </MasterDetailLayout>
  );

  const activeNamespace = packMeta.namespace.trim() || 'custom';
  const makeDefaultId = (path) => path;
  const toDisplayId = (value) => {
    if (!value) return '';
    const { namespace, path, hasNamespace } = splitResourceLocation(value, activeNamespace);
    const displayNamespace = hasNamespace ? namespace : activeNamespace;
    return path ? `${displayNamespace}:${path}` : '';
  };
  const fromDisplayId = (value) => {
    if (!value) return '';
    const { namespace, path, hasNamespace } = splitResourceLocation(value, activeNamespace);
    if (hasNamespace) return `${namespace}:${path}`;
    return path || value;
  };

  const applyImportedCollections = (entriesByType, tagEntries) => {
    const applyCollection = (entries, setItems, setSelected) => {
      setItems(entries);
      setSelected(entries.length > 0 ? 0 : null);
    };

    applyCollection(entriesByType.biome, setBiomes, setSelectedBiome);
    applyCollection(entriesByType.configured_feature, setConfiguredFeatures, setSelectedConfiguredFeature);
    applyCollection(entriesByType.placed_feature, setPlacedFeatures, setSelectedPlacedFeature);
    applyCollection(entriesByType.configured_carver, setConfiguredCarvers, setSelectedConfiguredCarver);
    applyCollection(entriesByType.structure, setStructures, setSelectedStructure);
    applyCollection(entriesByType.structure_set, setStructureSets, setSelectedStructureSet);
    applyCollection(entriesByType.template_pool, setTemplatePools, setSelectedTemplatePool);
    applyCollection(entriesByType.processor_list, setProcessorLists, setSelectedProcessorList);
    applyCollection(entriesByType.noise_settings, setNoiseSettingsList, setSelectedNoiseSettings);
    applyCollection(entriesByType.density_function, setDensityFunctions, setSelectedDensityFunction);
    applyCollection(entriesByType.noise, setNoises, setSelectedNoise);
    applyCollection(entriesByType.dimension, setDimensions, setSelectedDimension);
    applyCollection(entriesByType.world_preset, setWorldPresets, setSelectedWorldPreset);
    applyCollection(entriesByType.flat_level_generator_preset, setFlatPresets, setSelectedFlatPreset);
    applyCollection(tagEntries, setTags, setSelectedTag);
  };

  const handleDatapackImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setImportStatus(null);
    setPackMcmeta(createDefaultPackMcmeta());

    try {
      const { entriesByType, total, errors, namespaces, packMeta: importedMeta, tagEntries } =
        await parseDatapackZip(file);
      if (total === 0) {
        setImportStatus({ variant: 'error', message: 'No supported JSON files found in the zip.' });
        return;
      }

      applyImportedCollections(entriesByType, tagEntries);
      setPackMeta((prev) => {
        const next = { ...prev };
        if (namespaces.length > 0) next.namespace = namespaces[0];
        return next;
      });
      if (importedMeta?.raw) {
        setPackMcmeta(importedMeta.raw);
      }
      const message = errors.length
        ? `Imported ${total} files with ${errors.length} errors.`
        : `Imported ${total} files.`;
      setImportStatus({ variant: errors.length ? 'warning' : 'success', message });
    } catch (error) {
      setImportStatus({ variant: 'error', message: `Import failed: ${error?.message || String(error)}` });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleDatapackExport = async () => {
    setIsExporting(true);
    setExportStatus(null);

    try {
      const zip = new JSZip();
      const warnings = [];
      const defaultNamespace = packMeta.namespace.trim() || 'custom';
      const reservedPaths = new Set(['pack.mcmeta']);

      zip.file('pack.mcmeta', JSON.stringify(packMcmeta || createDefaultPackMcmeta(), null, 2));

      const addEntries = (type, items) => {
        items.forEach((item) => {
          if (!item?.id) {
            warnings.push(`${type}: entry missing id`);
            return;
          }
          const { namespace: entryNamespace, path } = splitResourceLocation(item.id, defaultNamespace);
          const namespace = entryNamespace || defaultNamespace;
          if (!path) {
            warnings.push(`${type}: invalid id "${item.id}"`);
            return;
          }
          const filePath = `data/${namespace}/worldgen/${type}/${path}.json`;
          reservedPaths.add(filePath);
          zip.file(filePath, JSON.stringify(item.data ?? {}, null, 2));
        });
      };

      const addTags = (items) => {
        items.forEach((item) => {
          if (!item?.id) {
            warnings.push('tag: entry missing id');
            return;
          }
          const { namespace: entryNamespace, path } = splitResourceLocation(item.id, defaultNamespace);
          const namespace = entryNamespace || defaultNamespace;
          if (!path) {
            warnings.push(`tag: invalid id "${item.id}"`);
            return;
          }
          const filePath = `data/${namespace}/tags/${path}.json`;
          reservedPaths.add(filePath);
          zip.file(filePath, JSON.stringify(item.data ?? {}, null, 2));
        });
      };

      addEntries('biome', biomes);
      addEntries('configured_feature', configuredFeatures);
      addEntries('placed_feature', placedFeatures);
      addEntries('configured_carver', configuredCarvers);
      addEntries('structure', structures);
      addEntries('structure_set', structureSets);
      addEntries('template_pool', templatePools);
      addEntries('processor_list', processorLists);
      addEntries('noise_settings', noiseSettingsList);
      addEntries('density_function', densityFunctions);
      addEntries('noise', noises);
      addEntries('dimension', dimensions);
      addEntries('world_preset', worldPresets);
      addEntries('flat_level_generator_preset', flatPresets);
      addTags(tags);

      const blob = await zip.generateAsync({ type: 'blob' });
      const filename = sanitizeFilename(packMeta.namespace || 'datapack');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setExportStatus({
        variant: warnings.length ? 'warning' : 'success',
        message: warnings.length
          ? `Downloaded with ${warnings.length} warnings.`
          : 'Datapack downloaded.'
      });
    } catch (error) {
      setExportStatus({ variant: 'error', message: `Export failed: ${error?.message || String(error)}` });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__title">
          <span>Minecraft Datapack Builder</span>
          <span className="app__subtitle">Worldgen Editor</span>
        </div>
        <div className="app__header-actions">
          {importStatus && <Badge variant={importStatus.variant}>{importStatus.message}</Badge>}
          {exportStatus && <Badge variant={exportStatus.variant}>{exportStatus.message}</Badge>}
          <input
            ref={fileInputRef}
            type="file"
            accept=".zip,application/zip"
            className="app__file-input"
            onChange={handleDatapackImport}
          />
          <Button
            variant="primary"
            icon={<Upload size={16} />}
            loading={isImporting}
            onClick={() => fileInputRef.current?.click()}
          >
            Import datapack
          </Button>
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            loading={isExporting}
            onClick={handleDatapackExport}
          >
            Download datapack
          </Button>
        </div>
      </header>
      <main className="app__content">
        <aside className="app__sidebar">
          {editorGroups.map((group) => (
            <div key={group.label} className="app__nav-group">
              <div className="app__nav-title">{group.label}</div>
              <div className="app__nav-list">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`app__nav-item ${activeEditor === item.id ? 'app__nav-item--active' : ''}`}
                    onClick={() => setActiveEditor(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <section className="app__main">
          <TabPanel id="metadata" activeTab={activeEditor}>
            <div className="metadata-stack">
              <Card title="Datapack Metadata" className="app__meta-card">
                <div className="app__meta-grid">
                  <FormField label="Namespace">
                    <Input
                      value={packMeta.namespace}
                      onChange={(event) => setPackMeta((prev) => ({ ...prev, namespace: event.target.value }))}
                      placeholder="example_namespace"
                    />
                  </FormField>
                </div>
              </Card>

              <PackMcmetaEditor value={packMcmeta} onChange={setPackMcmeta} />
            </div>
          </TabPanel>

          <TabPanel id="biome" activeTab={activeEditor}>
            {renderCollection({
              title: 'Biomes',
              items: biomes,
              selectedIndex: selectedBiome,
              setSelectedIndex: setSelectedBiome,
              setItems: setBiomes,
              defaultId: makeDefaultId('custom_biome'),
              defaultData: createDefaultBiome,
              renderEditor: (entry, index) => (
                <BiomeEditor
                  value={entry.data}
                  onChange={(data) => setBiomes((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setBiomes((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="configured_feature" activeTab={activeEditor}>
            {renderCollection({
              title: 'Configured Features',
              items: configuredFeatures,
              selectedIndex: selectedConfiguredFeature,
              setSelectedIndex: setSelectedConfiguredFeature,
              setItems: setConfiguredFeatures,
              defaultId: makeDefaultId('custom_feature'),
              defaultData: createDefaultConfiguredFeature,
              renderEditor: (entry, index) => (
                <ConfiguredFeatureEditor
                  value={entry.data}
                  onChange={(data) => setConfiguredFeatures((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setConfiguredFeatures((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="placed_feature" activeTab={activeEditor}>
            {renderCollection({
              title: 'Placed Features',
              items: placedFeatures,
              selectedIndex: selectedPlacedFeature,
              setSelectedIndex: setSelectedPlacedFeature,
              setItems: setPlacedFeatures,
              defaultId: makeDefaultId('custom_placed'),
              defaultData: createDefaultPlacedFeature,
              renderEditor: (entry, index) => (
                <PlacedFeatureEditor
                  value={entry.data}
                  onChange={(data) => setPlacedFeatures((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setPlacedFeatures((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="configured_carver" activeTab={activeEditor}>
            {renderCollection({
              title: 'Configured Carvers',
              items: configuredCarvers,
              selectedIndex: selectedConfiguredCarver,
              setSelectedIndex: setSelectedConfiguredCarver,
              setItems: setConfiguredCarvers,
              defaultId: makeDefaultId('custom_carver'),
              defaultData: createDefaultConfiguredCarver,
              renderEditor: (entry, index) => (
                <ConfiguredCarverEditor
                  value={entry.data}
                  onChange={(data) => setConfiguredCarvers((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setConfiguredCarvers((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="structure" activeTab={activeEditor}>
            {renderCollection({
              title: 'Structures',
              items: structures,
              selectedIndex: selectedStructure,
              setSelectedIndex: setSelectedStructure,
              setItems: setStructures,
              defaultId: makeDefaultId('custom_structure'),
              defaultData: createDefaultStructure,
              renderEditor: (entry, index) => (
                <StructureEditor
                  value={entry.data}
                  onChange={(data) => setStructures((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setStructures((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="structure_set" activeTab={activeEditor}>
            {renderCollection({
              title: 'Structure Sets',
              items: structureSets,
              selectedIndex: selectedStructureSet,
              setSelectedIndex: setSelectedStructureSet,
              setItems: setStructureSets,
              defaultId: makeDefaultId('custom_structure_set'),
              defaultData: createDefaultStructureSet,
              renderEditor: (entry, index) => (
                <StructureSetEditor
                  value={entry.data}
                  onChange={(data) => setStructureSets((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setStructureSets((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="template_pool" activeTab={activeEditor}>
            {renderCollection({
              title: 'Template Pools',
              items: templatePools,
              selectedIndex: selectedTemplatePool,
              setSelectedIndex: setSelectedTemplatePool,
              setItems: setTemplatePools,
              defaultId: makeDefaultId('custom_pool'),
              defaultData: createDefaultTemplatePool,
              renderEditor: (entry, index) => (
                <TemplatePoolEditor
                  value={entry.data}
                  onChange={(data) => setTemplatePools((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setTemplatePools((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="processor_list" activeTab={activeEditor}>
            {renderCollection({
              title: 'Processor Lists',
              items: processorLists,
              selectedIndex: selectedProcessorList,
              setSelectedIndex: setSelectedProcessorList,
              setItems: setProcessorLists,
              defaultId: makeDefaultId('custom_processor_list'),
              defaultData: createDefaultProcessorList,
              renderEditor: (entry, index) => (
                <ProcessorListEditor
                  value={entry.data}
                  onChange={(data) => setProcessorLists((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setProcessorLists((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="noise_settings" activeTab={activeEditor}>
            {renderCollection({
              title: 'Noise Settings',
              items: noiseSettingsList,
              selectedIndex: selectedNoiseSettings,
              setSelectedIndex: setSelectedNoiseSettings,
              setItems: setNoiseSettingsList,
              defaultId: makeDefaultId('custom_noise_settings'),
              defaultData: createDefaultNoiseSettings,
              renderEditor: (entry, index) => (
                <NoiseSettingsEditor
                  value={entry.data}
                  onChange={(data) => setNoiseSettingsList((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setNoiseSettingsList((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="density_function" activeTab={activeEditor}>
            {renderCollection({
              title: 'Density Functions',
              items: densityFunctions,
              selectedIndex: selectedDensityFunction,
              setSelectedIndex: setSelectedDensityFunction,
              setItems: setDensityFunctions,
              defaultId: makeDefaultId('custom_density'),
              defaultData: createDefaultDensityFunction,
              renderEditor: (entry, index) => (
                <DensityFunctionEditor
                  value={entry.data}
                  onChange={(data) => setDensityFunctions((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setDensityFunctions((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="noise" activeTab={activeEditor}>
            {renderCollection({
              title: 'Noise',
              items: noises,
              selectedIndex: selectedNoise,
              setSelectedIndex: setSelectedNoise,
              setItems: setNoises,
              defaultId: makeDefaultId('custom_noise'),
              defaultData: createDefaultNoise,
              renderEditor: (entry, index) => (
                <NoiseEditor
                  value={entry.data}
                  onChange={(data) => setNoises((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setNoises((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="dimension" activeTab={activeEditor}>
            {renderCollection({
              title: 'Dimensions',
              items: dimensions,
              selectedIndex: selectedDimension,
              setSelectedIndex: setSelectedDimension,
              setItems: setDimensions,
              defaultId: makeDefaultId('custom_dimension'),
              defaultData: createDefaultDimension,
              renderEditor: (entry, index) => (
                <DimensionEditor
                  value={entry.data}
                  onChange={(data) => setDimensions((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setDimensions((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="world_preset" activeTab={activeEditor}>
            {renderCollection({
              title: 'World Presets',
              items: worldPresets,
              selectedIndex: selectedWorldPreset,
              setSelectedIndex: setSelectedWorldPreset,
              setItems: setWorldPresets,
              defaultId: makeDefaultId('custom_preset'),
              defaultData: createDefaultWorldPreset,
              renderEditor: (entry, index) => (
                <WorldPresetEditor
                  value={entry.data}
                  onChange={(data) => setWorldPresets((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setWorldPresets((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="flat_level_generator_preset" activeTab={activeEditor}>
            {renderCollection({
              title: 'Flat Presets',
              items: flatPresets,
              selectedIndex: selectedFlatPreset,
              setSelectedIndex: setSelectedFlatPreset,
              setItems: setFlatPresets,
              defaultId: makeDefaultId('custom_flat'),
              defaultData: createDefaultFlatPreset,
              renderEditor: (entry, index) => (
                <FlatLevelGeneratorPresetEditor
                  value={entry.data}
                  onChange={(data) => setFlatPresets((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setFlatPresets((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="tag" activeTab={activeEditor}>
            {renderCollection({
              title: 'Tags',
              items: tags,
              selectedIndex: selectedTag,
              setSelectedIndex: setSelectedTag,
              setItems: setTags,
              defaultId: makeDefaultId('worldgen/biome/custom_tag'),
              defaultData: createDefaultTag,
              renderEditor: (entry, index) => (
                <TagEditor
                  value={entry.data}
                  onChange={(data) => setTags((prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setTags((prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>
        </section>
      </main>
    </div>
  );
}
