import React, { useCallback, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Download, Layers, Plus, Upload, X } from 'lucide-react';
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

const BASE_DATA_PATTERN = /^data\/([^/]+)\/worldgen\/([^/]+)\/(.+)\.json$/;
const BASE_TAG_PATTERN = /^data\/([^/]+)\/tags\/(.+)\.json$/;
const OVERLAY_DATA_PATTERN = /^([^/]+)\/data\/([^/]+)\/worldgen\/([^/]+)\/(.+)\.json$/;
const OVERLAY_TAG_PATTERN = /^([^/]+)\/data\/([^/]+)\/tags\/(.+)\.json$/;

const createEmptyLayer = () => ({
  ...Object.fromEntries(WORLDGEN_TYPES.map((type) => [type, []])),
  tag: []
});

const createEmptySelections = () => ({
  ...Object.fromEntries(WORLDGEN_TYPES.map((type) => [type, null])),
  tag: null
});

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
  const layersByName = { data: createEmptyLayer() };
  const errors = [];
  const namespaceCounts = new Map();

  const ensureLayer = (layerName) => {
    if (!layersByName[layerName]) {
      layersByName[layerName] = createEmptyLayer();
    }
  };

  await Promise.all(
    Object.values(zip.files).map(async (zipEntry) => {
      if (zipEntry.dir) return;
      if (zipEntry.name === 'pack.mcmeta') return;

      let layerName = 'data';
      let namespace, type, path, isTag = false;

      // Try base tag pattern
      const baseTagMatch = zipEntry.name.match(BASE_TAG_PATTERN);
      if (baseTagMatch) {
        [, namespace, path] = baseTagMatch;
        isTag = true;
      }

      // Try overlay tag pattern
      if (!isTag) {
        const overlayTagMatch = zipEntry.name.match(OVERLAY_TAG_PATTERN);
        if (overlayTagMatch) {
          [, layerName, namespace, path] = overlayTagMatch;
          isTag = true;
        }
      }

      if (isTag) {
        ensureLayer(layerName);
        namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          const data = JSON.parse(contents);
          layersByName[layerName].tag.push({ id: `${namespace}:${path}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }

      // Try base data pattern
      const baseMatch = zipEntry.name.match(BASE_DATA_PATTERN);
      if (baseMatch) {
        [, namespace, type, path] = baseMatch;
        layerName = 'data';
      } else {
        // Try overlay data pattern
        const overlayMatch = zipEntry.name.match(OVERLAY_DATA_PATTERN);
        if (overlayMatch) {
          [, layerName, namespace, type, path] = overlayMatch;
        } else {
          return;
        }
      }

      ensureLayer(layerName);
      if (!layersByName[layerName][type]) return;

      namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
      try {
        const contents = await zipEntry.async('string');
        const data = JSON.parse(contents);
        layersByName[layerName][type].push({ id: `${namespace}:${path}`, data });
      } catch (error) {
        errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
      }
    })
  );

  // Sort all entries in all layers
  for (const layer of Object.values(layersByName)) {
    for (const type of [...WORLDGEN_TYPES, 'tag']) {
      layer[type].sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  let total = 0;
  for (const layer of Object.values(layersByName)) {
    for (const type of [...WORLDGEN_TYPES, 'tag']) {
      total += layer[type].length;
    }
  }

  const packMeta = await extractPackMeta(zip);
  const namespaces = Array.from(namespaceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([namespace]) => namespace);
  return { layersByName, total, errors, namespaces, packMeta };
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
  const [layers, setLayers] = useState({ data: createEmptyLayer() });
  const [activeLayer, setActiveLayer] = useState('data');
  const [selections, setSelections] = useState({ data: createEmptySelections() });

  const [packMeta, setPackMeta] = useState({ namespace: '' });
  const [packMcmeta, setPackMcmeta] = useState(createDefaultPackMcmeta());
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  const layerNames = Object.keys(layers);
  const currentLayer = layers[activeLayer] || createEmptyLayer();
  const currentSelections = selections[activeLayer] || createEmptySelections();

  const getItems = useCallback((type) => currentLayer[type] || [], [currentLayer]);
  const getSelectedIndex = useCallback((type) => currentSelections[type], [currentSelections]);

  const setItems = useCallback((type, updater) => {
    setLayers((prev) => {
      const layer = prev[activeLayer] || createEmptyLayer();
      const oldItems = layer[type] || [];
      const newItems = typeof updater === 'function' ? updater(oldItems) : updater;
      return { ...prev, [activeLayer]: { ...layer, [type]: newItems } };
    });
  }, [activeLayer]);

  const setSelectedIndex = useCallback((type, index) => {
    setSelections((prev) => ({
      ...prev,
      [activeLayer]: { ...(prev[activeLayer] || createEmptySelections()), [type]: index }
    }));
  }, [activeLayer]);

  const addLayer = (name) => {
    if (layers[name]) return;
    setLayers((prev) => ({ ...prev, [name]: createEmptyLayer() }));
    setSelections((prev) => ({ ...prev, [name]: createEmptySelections() }));
  };

  const removeLayer = (name) => {
    if (name === 'data') return;
    setLayers((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setSelections((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    if (activeLayer === name) setActiveLayer('data');
  };

  const editorTypeForActiveEditor = activeEditor === 'tag' ? 'tag' : activeEditor;
  const activeItems = getItems(editorTypeForActiveEditor);
  const activeSelectedIndex = getSelectedIndex(editorTypeForActiveEditor);

  const getActiveEntry = () => {
    if (activeEditor === 'metadata') return null;
    return activeItems[activeSelectedIndex] || null;
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
    type,
    defaultId,
    defaultData,
    renderEditor
  }) => {
    const items = getItems(type);
    const selectedIndex = getSelectedIndex(type);
    return (
      <MasterDetailLayout
        title={title}
        items={items}
        selectedIndex={selectedIndex}
        onSelect={(idx) => setSelectedIndex(type, idx)}
        onAdd={() => {
          setItems(type, (prev) => {
            const nextId = makeUniqueId(defaultId, prev);
            const next = [...prev, { id: nextId, data: defaultData() }];
            setSelectedIndex(type, next.length - 1);
            return next;
          });
        }}
        onRemove={(index) => {
          setItems(type, (prev) => {
            const next = prev.filter((_, i) => i !== index);
            if (next.length === 0) {
              setSelectedIndex(type, null);
            } else {
              setSelectedIndex(type, Math.min(index, next.length - 1));
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
  };

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

  const handleDatapackImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    setImportStatus(null);
    setPackMcmeta(createDefaultPackMcmeta());

    try {
      const { layersByName, total, errors, namespaces, packMeta: importedMeta } =
        await parseDatapackZip(file);
      if (total === 0) {
        setImportStatus({ variant: 'error', message: 'No supported JSON files found in the zip.' });
        return;
      }

      setLayers(layersByName);
      const newSelections = {};
      for (const [name, layer] of Object.entries(layersByName)) {
        const sel = createEmptySelections();
        for (const type of [...WORLDGEN_TYPES, 'tag']) {
          sel[type] = layer[type].length > 0 ? 0 : null;
        }
        newSelections[name] = sel;
      }
      setSelections(newSelections);
      setActiveLayer('data');

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

      zip.file('pack.mcmeta', JSON.stringify(packMcmeta || createDefaultPackMcmeta(), null, 2));

      const addEntries = (prefix, type, items) => {
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
          const filePath = `${prefix}data/${namespace}/worldgen/${type}/${path}.json`;
          zip.file(filePath, JSON.stringify(item.data ?? {}, null, 2));
        });
      };

      const addTags = (prefix, items) => {
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
          const filePath = `${prefix}data/${namespace}/tags/${path}.json`;
          zip.file(filePath, JSON.stringify(item.data ?? {}, null, 2));
        });
      };

      for (const [layerName, layer] of Object.entries(layers)) {
        const prefix = layerName === 'data' ? '' : `${layerName}/`;
        for (const type of WORLDGEN_TYPES) {
          addEntries(prefix, type, layer[type] || []);
        }
        addTags(prefix, layer.tag || []);
      }

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

  const handleAddOverlay = () => {
    const name = prompt('Enter overlay directory name (e.g. overlay_39):');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    if (trimmed === 'data') return;
    addLayer(trimmed);
    setActiveLayer(trimmed);
    // Auto-add overlay entry to pack.mcmeta if not present
    const overlays = packMcmeta.overlays || {};
    const entries = Array.isArray(overlays.entries) ? overlays.entries : [];
    if (!entries.some((e) => e.directory === trimmed)) {
      setPackMcmeta((prev) => ({
        ...prev,
        overlays: {
          ...(prev.overlays || {}),
          entries: [...entries, { directory: trimmed, formats: [] }]
        }
      }));
    }
  };

  const handleRemoveLayer = (name) => {
    if (name === 'data') return;
    if (!confirm(`Remove overlay "${name}" and all its contents?`)) return;
    removeLayer(name);
  };

  const handlePackMcmetaChange = useCallback((newMcmeta) => {
    setPackMcmeta(newMcmeta);
    // Sync overlay layers with mcmeta overlay entries
    const overlayEntries = newMcmeta?.overlays?.entries || [];
    const overlayDirs = new Set(overlayEntries.map((e) => e.directory).filter(Boolean));
    // Add layers for new overlay entries
    for (const dir of overlayDirs) {
      if (!layers[dir]) {
        addLayer(dir);
      }
    }
  }, [layers]);

  const makeEditorProps = (type) => ({
    onChange: (data) => setItems(type, (prev) => updateItem(prev, getSelectedIndex(type), { data })),
    onIdChange: (id) => setItems(type, (prev) => updateItem(prev, getSelectedIndex(type), { id: fromDisplayId(id) }))
  });

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

      <div className="app__layer-bar">
        <Layers size={14} className="app__layer-icon" />
        {layerNames.map((name) => (
          <button
            key={name}
            type="button"
            className={`app__layer-tab ${activeLayer === name ? 'app__layer-tab--active' : ''}`}
            onClick={() => setActiveLayer(name)}
          >
            <span>{name === 'data' ? 'data/' : `${name}/`}</span>
            {name !== 'data' && (
              <span
                className="app__layer-tab-close"
                onClick={(e) => { e.stopPropagation(); handleRemoveLayer(name); }}
              >
                <X size={12} />
              </span>
            )}
          </button>
        ))}
        <button type="button" className="app__layer-add" onClick={handleAddOverlay}>
          <Plus size={14} />
          <span>Overlay</span>
        </button>
      </div>

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

              <PackMcmetaEditor value={packMcmeta} onChange={handlePackMcmetaChange} />
            </div>
          </TabPanel>

          <TabPanel id="biome" activeTab={activeEditor}>
            {renderCollection({
              title: 'Biomes',
              type: 'biome',
              defaultId: makeDefaultId('custom_biome'),
              defaultData: createDefaultBiome,
              renderEditor: (entry, index) => (
                <BiomeEditor
                  value={entry.data}
                  onChange={(data) => setItems('biome', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('biome', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="configured_feature" activeTab={activeEditor}>
            {renderCollection({
              title: 'Configured Features',
              type: 'configured_feature',
              defaultId: makeDefaultId('custom_feature'),
              defaultData: createDefaultConfiguredFeature,
              renderEditor: (entry, index) => (
                <ConfiguredFeatureEditor
                  value={entry.data}
                  onChange={(data) => setItems('configured_feature', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('configured_feature', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="placed_feature" activeTab={activeEditor}>
            {renderCollection({
              title: 'Placed Features',
              type: 'placed_feature',
              defaultId: makeDefaultId('custom_placed'),
              defaultData: createDefaultPlacedFeature,
              renderEditor: (entry, index) => (
                <PlacedFeatureEditor
                  value={entry.data}
                  onChange={(data) => setItems('placed_feature', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('placed_feature', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="configured_carver" activeTab={activeEditor}>
            {renderCollection({
              title: 'Configured Carvers',
              type: 'configured_carver',
              defaultId: makeDefaultId('custom_carver'),
              defaultData: createDefaultConfiguredCarver,
              renderEditor: (entry, index) => (
                <ConfiguredCarverEditor
                  value={entry.data}
                  onChange={(data) => setItems('configured_carver', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('configured_carver', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="structure" activeTab={activeEditor}>
            {renderCollection({
              title: 'Structures',
              type: 'structure',
              defaultId: makeDefaultId('custom_structure'),
              defaultData: createDefaultStructure,
              renderEditor: (entry, index) => (
                <StructureEditor
                  value={entry.data}
                  onChange={(data) => setItems('structure', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('structure', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="structure_set" activeTab={activeEditor}>
            {renderCollection({
              title: 'Structure Sets',
              type: 'structure_set',
              defaultId: makeDefaultId('custom_structure_set'),
              defaultData: createDefaultStructureSet,
              renderEditor: (entry, index) => (
                <StructureSetEditor
                  value={entry.data}
                  onChange={(data) => setItems('structure_set', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('structure_set', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="template_pool" activeTab={activeEditor}>
            {renderCollection({
              title: 'Template Pools',
              type: 'template_pool',
              defaultId: makeDefaultId('custom_pool'),
              defaultData: createDefaultTemplatePool,
              renderEditor: (entry, index) => (
                <TemplatePoolEditor
                  value={entry.data}
                  onChange={(data) => setItems('template_pool', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('template_pool', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="processor_list" activeTab={activeEditor}>
            {renderCollection({
              title: 'Processor Lists',
              type: 'processor_list',
              defaultId: makeDefaultId('custom_processor_list'),
              defaultData: createDefaultProcessorList,
              renderEditor: (entry, index) => (
                <ProcessorListEditor
                  value={entry.data}
                  onChange={(data) => setItems('processor_list', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('processor_list', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="noise_settings" activeTab={activeEditor}>
            {renderCollection({
              title: 'Noise Settings',
              type: 'noise_settings',
              defaultId: makeDefaultId('custom_noise_settings'),
              defaultData: createDefaultNoiseSettings,
              renderEditor: (entry, index) => (
                <NoiseSettingsEditor
                  value={entry.data}
                  onChange={(data) => setItems('noise_settings', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('noise_settings', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="density_function" activeTab={activeEditor}>
            {renderCollection({
              title: 'Density Functions',
              type: 'density_function',
              defaultId: makeDefaultId('custom_density'),
              defaultData: createDefaultDensityFunction,
              renderEditor: (entry, index) => (
                <DensityFunctionEditor
                  value={entry.data}
                  onChange={(data) => setItems('density_function', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('density_function', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="noise" activeTab={activeEditor}>
            {renderCollection({
              title: 'Noise',
              type: 'noise',
              defaultId: makeDefaultId('custom_noise'),
              defaultData: createDefaultNoise,
              renderEditor: (entry, index) => (
                <NoiseEditor
                  value={entry.data}
                  onChange={(data) => setItems('noise', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('noise', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="dimension" activeTab={activeEditor}>
            {renderCollection({
              title: 'Dimensions',
              type: 'dimension',
              defaultId: makeDefaultId('custom_dimension'),
              defaultData: createDefaultDimension,
              renderEditor: (entry, index) => (
                <DimensionEditor
                  value={entry.data}
                  onChange={(data) => setItems('dimension', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('dimension', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="world_preset" activeTab={activeEditor}>
            {renderCollection({
              title: 'World Presets',
              type: 'world_preset',
              defaultId: makeDefaultId('custom_preset'),
              defaultData: createDefaultWorldPreset,
              renderEditor: (entry, index) => (
                <WorldPresetEditor
                  value={entry.data}
                  onChange={(data) => setItems('world_preset', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('world_preset', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="flat_level_generator_preset" activeTab={activeEditor}>
            {renderCollection({
              title: 'Flat Presets',
              type: 'flat_level_generator_preset',
              defaultId: makeDefaultId('custom_flat'),
              defaultData: createDefaultFlatPreset,
              renderEditor: (entry, index) => (
                <FlatLevelGeneratorPresetEditor
                  value={entry.data}
                  onChange={(data) => setItems('flat_level_generator_preset', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) =>
                    setItems('flat_level_generator_preset', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))
                  }
                />
              )
            })}
          </TabPanel>

          <TabPanel id="tag" activeTab={activeEditor}>
            {renderCollection({
              title: 'Tags',
              type: 'tag',
              defaultId: makeDefaultId('worldgen/biome/custom_tag'),
              defaultData: createDefaultTag,
              renderEditor: (entry, index) => (
                <TagEditor
                  value={entry.data}
                  onChange={(data) => setItems('tag', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setItems('tag', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>
        </section>
      </main>
    </div>
  );
}
