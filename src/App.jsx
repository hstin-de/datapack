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
import { LootTableEditor } from './editors/LootTableEditor.jsx';
import { RecipeEditor } from './editors/RecipeEditor.jsx';
import { AdvancementEditor } from './editors/AdvancementEditor.jsx';
import { PredicateEditor } from './editors/PredicateEditor.jsx';
import { ItemModifierEditor } from './editors/ItemModifierEditor.jsx';
import { DimensionTypeEditor } from './editors/DimensionTypeEditor.jsx';
import { DamageTypeEditor } from './editors/DamageTypeEditor.jsx';
import { ChatTypeEditor } from './editors/ChatTypeEditor.jsx';
import { FunctionEditor } from './editors/FunctionEditor.jsx';
import { NbtManager } from './editors/NbtManager.jsx';
import { GenericRegistryEditor } from './editors/GenericRegistryEditor.jsx';
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
  validateTag,
  validateGenericJson
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
      { id: 'processor_list', label: 'Processor Lists' },
      { id: 'nbt', label: 'Structure NBT' }
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
      { id: 'dimension_type', label: 'Dimension Types' },
      { id: 'world_preset', label: 'World Presets' },
      { id: 'flat_level_generator_preset', label: 'Flat Presets' }
    ]
  },
  {
    label: 'Gameplay',
    items: [
      { id: 'loot_table', label: 'Loot Tables' },
      { id: 'recipe', label: 'Recipes' },
      { id: 'advancement', label: 'Advancements' },
      { id: 'predicate', label: 'Predicates' },
      { id: 'item_modifier', label: 'Item Modifiers' },
      { id: 'function', label: 'Functions' }
    ]
  },
  {
    label: 'Registry',
    items: [
      { id: 'damage_type', label: 'Damage Types' },
      { id: 'chat_type', label: 'Chat Types' },
      { id: 'trim_pattern', label: 'Trim Patterns' },
      { id: 'trim_material', label: 'Trim Materials' },
      { id: 'banner_pattern', label: 'Banner Patterns' },
      { id: 'wolf_variant', label: 'Wolf Variants' },
      { id: 'enchantment', label: 'Enchantments' },
      { id: 'jukebox_song', label: 'Jukebox Songs' },
      { id: 'painting_variant', label: 'Painting Variants' }
    ]
  },
  {
    label: 'Other',
    items: [{ id: 'passthrough', label: 'Other Files' }]
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
  tag: 'Tag',
  loot_table: 'Loot Table',
  recipe: 'Recipe',
  advancement: 'Advancement',
  predicate: 'Predicate',
  item_modifier: 'Item Modifier',
  dimension_type: 'Dimension Type',
  damage_type: 'Damage Type',
  chat_type: 'Chat Type',
  trim_pattern: 'Trim Pattern',
  trim_material: 'Trim Material',
  banner_pattern: 'Banner Pattern',
  wolf_variant: 'Wolf Variant',
  enchantment: 'Enchantment',
  jukebox_song: 'Jukebox Song',
  painting_variant: 'Painting Variant',
  function: 'Function',
  nbt: 'NBT Structure'
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
  'world_preset',
  'flat_level_generator_preset'
];

const DATAPACK_TYPES = [
  'dimension',
  'loot_table', 'recipe', 'advancement', 'predicate',
  'item_modifier', 'dimension_type', 'damage_type',
  'chat_type', 'trim_pattern', 'trim_material',
  'banner_pattern', 'wolf_variant', 'enchantment',
  'jukebox_song', 'painting_variant'
];

const ALL_TYPES = [...WORLDGEN_TYPES, ...DATAPACK_TYPES, 'tag', 'function', 'nbt'];

const BASE_DATA_PATTERN = /^data\/([^/]+)\/worldgen\/([^/]+)\/(.+)\.json$/;
const BASE_TAG_PATTERN = /^data\/([^/]+)\/tags\/(.+)\.json$/;
const OVERLAY_DATA_PATTERN = /^([^/]+)\/data\/([^/]+)\/worldgen\/([^/]+)\/(.+)\.json$/;
const OVERLAY_TAG_PATTERN = /^([^/]+)\/data\/([^/]+)\/tags\/(.+)\.json$/;
const BASE_DATAPACK_PATTERN = /^data\/([^/]+)\/([^/]+)\/(.+)\.json$/;
const OVERLAY_DATAPACK_PATTERN = /^([^/]+)\/data\/([^/]+)\/([^/]+)\/(.+)\.json$/;
const BASE_FUNCTION_PATTERN = /^data\/([^/]+)\/function\/(.+)\.mcfunction$/;
const OVERLAY_FUNCTION_PATTERN = /^([^/]+)\/data\/([^/]+)\/function\/(.+)\.mcfunction$/;
const BASE_NBT_PATTERN = /^data\/([^/]+)\/structure\/(.+)\.nbt$/;
const OVERLAY_NBT_PATTERN = /^([^/]+)\/data\/([^/]+)\/structure\/(.+)\.nbt$/;

const createEmptyLayer = () => ({
  ...Object.fromEntries(WORLDGEN_TYPES.map((type) => [type, []])),
  ...Object.fromEntries(DATAPACK_TYPES.map((type) => [type, []])),
  tag: [],
  function: [],
  nbt: [],
  _passthrough: []
});

const createEmptySelections = () => ({
  ...Object.fromEntries(WORLDGEN_TYPES.map((type) => [type, null])),
  ...Object.fromEntries(DATAPACK_TYPES.map((type) => [type, null])),
  tag: null,
  function: null,
  nbt: null
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
  const rootPassthrough = [];
  const errors = [];
  const namespaceCounts = new Map();

  const allKnownCategories = new Set([...WORLDGEN_TYPES, ...DATAPACK_TYPES]);

  const ensureLayer = (layerName) => {
    if (!layersByName[layerName]) {
      layersByName[layerName] = createEmptyLayer();
    }
  };

  const storePassthrough = async (zipEntry, layerName) => {
    try {
      const data = await zipEntry.async('arraybuffer');
      ensureLayer(layerName);
      layersByName[layerName]._passthrough.push({ path: zipEntry.name, data });
    } catch (error) {
      errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
    }
  };

  await Promise.all(
    Object.values(zip.files).map(async (zipEntry) => {
      if (zipEntry.dir) return;
      if (zipEntry.name === 'pack.mcmeta') return;
      if (zipEntry.name === 'pack.png') return; // handled separately

      // Check if this is a data/ file or an overlay data/ file
      const isDataFile = zipEntry.name.startsWith('data/');
      const overlayDataMatch = !isDataFile && zipEntry.name.match(/^([^/]+)\/data\//);
      const isOverlayDataFile = Boolean(overlayDataMatch);

      // Root-level non-data files (license.txt, pack.png, patrons.txt, etc.)
      if (!isDataFile && !isOverlayDataFile) {
        // Check if it's an overlay directory with non-data content (e.g. empty-overlay/empty.txt)
        const overlayPrefix = zipEntry.name.match(/^([^/]+)\//);
        if (overlayPrefix) {
          try {
            const data = await zipEntry.async('arraybuffer');
            rootPassthrough.push({ path: zipEntry.name, data });
          } catch (error) {
            errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
          }
        } else {
          // Top-level file
          try {
            const data = await zipEntry.async('arraybuffer');
            rootPassthrough.push({ path: zipEntry.name, data });
          } catch (error) {
            errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
          }
        }
        return;
      }

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

      // Try .mcfunction files
      const baseFuncMatch = zipEntry.name.match(BASE_FUNCTION_PATTERN);
      if (baseFuncMatch) {
        const [, ns, p] = baseFuncMatch;
        ensureLayer('data');
        namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          layersByName['data'].function.push({ id: `${ns}:${p}`, data: contents });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }
      const overlayFuncMatch = zipEntry.name.match(OVERLAY_FUNCTION_PATTERN);
      if (overlayFuncMatch) {
        const [, ln, ns, p] = overlayFuncMatch;
        ensureLayer(ln);
        namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          layersByName[ln].function.push({ id: `${ns}:${p}`, data: contents });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }

      // Try .nbt files
      const baseNbtMatch = zipEntry.name.match(BASE_NBT_PATTERN);
      if (baseNbtMatch) {
        const [, ns, p] = baseNbtMatch;
        ensureLayer('data');
        namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
        try {
          const data = await zipEntry.async('arraybuffer');
          layersByName['data'].nbt.push({ id: `${ns}:${p}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }
      const overlayNbtMatch = zipEntry.name.match(OVERLAY_NBT_PATTERN);
      if (overlayNbtMatch) {
        const [, ln, ns, p] = overlayNbtMatch;
        ensureLayer(ln);
        namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
        try {
          const data = await zipEntry.async('arraybuffer');
          layersByName[ln].nbt.push({ id: `${ns}:${p}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }

      // Try base worldgen data pattern
      const baseMatch = zipEntry.name.match(BASE_DATA_PATTERN);
      if (baseMatch) {
        [, namespace, type, path] = baseMatch;
        layerName = 'data';

        ensureLayer(layerName);
        if (!layersByName[layerName][type]) {
          // Unknown worldgen subtype — store as passthrough
          await storePassthrough(zipEntry, layerName);
          return;
        }

        namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          const data = JSON.parse(contents);
          layersByName[layerName][type].push({ id: `${namespace}:${path}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }

      // Try overlay worldgen data pattern
      const overlayMatch = zipEntry.name.match(OVERLAY_DATA_PATTERN);
      if (overlayMatch) {
        [, layerName, namespace, type, path] = overlayMatch;

        ensureLayer(layerName);
        if (!layersByName[layerName][type]) {
          await storePassthrough(zipEntry, layerName);
          return;
        }

        namespaceCounts.set(namespace, (namespaceCounts.get(namespace) || 0) + 1);
        try {
          const contents = await zipEntry.async('string');
          const data = JSON.parse(contents);
          layersByName[layerName][type].push({ id: `${namespace}:${path}`, data });
        } catch (error) {
          errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
        }
        return;
      }

      // Try generic datapack pattern (non-worldgen, non-tags)
      const baseDatapackMatch = zipEntry.name.match(BASE_DATAPACK_PATTERN);
      if (baseDatapackMatch) {
        const [, ns, category, p] = baseDatapackMatch;
        // Skip categories already handled by specific patterns
        if (category === 'tags' || category === 'function' || category === 'structure') {
          // structure/ non-.nbt files, or other edge cases — passthrough
          await storePassthrough(zipEntry, 'data');
          return;
        }
        if (category === 'worldgen') {
          // worldgen files without a proper subtype folder (e.g. data/c/worldgen/biome_colors.json)
          await storePassthrough(zipEntry, 'data');
          return;
        }
        ensureLayer('data');
        if (allKnownCategories.has(category)) {
          namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
          try {
            const contents = await zipEntry.async('string');
            const data = JSON.parse(contents);
            layersByName['data'][category].push({ id: `${ns}:${p}`, data });
          } catch (error) {
            errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
          }
        } else {
          // Unknown category — passthrough
          await storePassthrough(zipEntry, 'data');
        }
        return;
      }

      const overlayDatapackMatch = zipEntry.name.match(OVERLAY_DATAPACK_PATTERN);
      if (overlayDatapackMatch) {
        const [, ln, ns, category, p] = overlayDatapackMatch;
        if (category === 'tags' || category === 'function' || category === 'structure') {
          await storePassthrough(zipEntry, ln);
          return;
        }
        if (category === 'worldgen') {
          await storePassthrough(zipEntry, ln);
          return;
        }
        ensureLayer(ln);
        if (allKnownCategories.has(category)) {
          namespaceCounts.set(ns, (namespaceCounts.get(ns) || 0) + 1);
          try {
            const contents = await zipEntry.async('string');
            const data = JSON.parse(contents);
            layersByName[ln][category].push({ id: `${ns}:${p}`, data });
          } catch (error) {
            errors.push(`${zipEntry.name}: ${error?.message || String(error)}`);
          }
        } else {
          await storePassthrough(zipEntry, ln);
        }
        return;
      }

      // Anything else — passthrough
      await storePassthrough(zipEntry, isOverlayDataFile ? overlayDataMatch[1] : 'data');
    })
  );

  // Sort all entries in all layers
  for (const layer of Object.values(layersByName)) {
    for (const type of ALL_TYPES) {
      if (layer[type]) layer[type].sort((a, b) => a.id.localeCompare(b.id));
    }
  }

  let total = 0;
  for (const layer of Object.values(layersByName)) {
    for (const type of ALL_TYPES) {
      if (layer[type]) total += layer[type].length;
    }
    total += layer._passthrough.length;
  }
  total += rootPassthrough.length;

  const packMeta = await extractPackMeta(zip);
  const packPngEntry = zip.file('pack.png');
  const packPng = packPngEntry ? await packPngEntry.async('arraybuffer') : null;
  const namespaces = Array.from(namespaceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([namespace]) => namespace);
  return { layersByName, rootPassthrough, total, errors, namespaces, packMeta, packPng };
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
  const [rootPassthrough, setRootPassthrough] = useState([]);
  const [packPng, setPackPng] = useState(null);
  const [importStatus, setImportStatus] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);
  const iconInputRef = useRef(null);
  const passthroughInputRef = useRef(null);

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

  const editorTypeForActiveEditor = activeEditor;
  const activeItems = getItems(editorTypeForActiveEditor);
  const activeSelectedIndex = getSelectedIndex(editorTypeForActiveEditor);

  const getActiveEntry = () => {
    if (activeEditor === 'metadata') return null;
    return activeItems[activeSelectedIndex] || null;
  };

  const activeEntry = getActiveEntry();

  const validation = useMemo(() => {
    if (!activeEntry) return { valid: true, errors: [] };
    if (activeEditor === 'nbt' || activeEditor === 'function') return { valid: true, errors: [] };
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
      case 'biome':
        return validateBiome(data);
      default:
        return validateGenericJson(data);
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
        onDuplicate={(index) => {
          setItems(type, (prev) => {
            const clone = JSON.parse(JSON.stringify(prev[index]));
            clone.id = makeUniqueId(clone.id, prev);
            const next = [...prev.slice(0, index + 1), clone, ...prev.slice(index + 1)];
            setSelectedIndex(type, index + 1);
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
      const { layersByName, rootPassthrough: importedPassthrough, total, errors, namespaces, packMeta: importedMeta, packPng: importedPackPng } =
        await parseDatapackZip(file);
      if (total === 0) {
        setImportStatus({ variant: 'error', message: 'No supported JSON files found in the zip.' });
        return;
      }

      setLayers(layersByName);
      setRootPassthrough(importedPassthrough || []);
      setPackPng(importedPackPng || null);
      const newSelections = {};
      for (const [name, layer] of Object.entries(layersByName)) {
        const sel = createEmptySelections();
        for (const type of ALL_TYPES) {
          if (layer[type]) sel[type] = layer[type].length > 0 ? 0 : null;
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

      const addDatapackEntries = (prefix, type, items) => {
        items.forEach((item) => {
          if (!item?.id) { warnings.push(`${type}: entry missing id`); return; }
          const { namespace: entryNamespace, path } = splitResourceLocation(item.id, defaultNamespace);
          const namespace = entryNamespace || defaultNamespace;
          if (!path) { warnings.push(`${type}: invalid id "${item.id}"`); return; }
          const filePath = `${prefix}data/${namespace}/${type}/${path}.json`;
          zip.file(filePath, JSON.stringify(item.data ?? {}, null, 2));
        });
      };

      const addFunctions = (prefix, items) => {
        items.forEach((item) => {
          if (!item?.id) { warnings.push('function: entry missing id'); return; }
          const { namespace: entryNamespace, path } = splitResourceLocation(item.id, defaultNamespace);
          const namespace = entryNamespace || defaultNamespace;
          if (!path) { warnings.push(`function: invalid id "${item.id}"`); return; }
          const filePath = `${prefix}data/${namespace}/function/${path}.mcfunction`;
          zip.file(filePath, typeof item.data === 'string' ? item.data : '');
        });
      };

      const addNbtFiles = (prefix, items) => {
        items.forEach((item) => {
          if (!item?.id) { warnings.push('nbt: entry missing id'); return; }
          const { namespace: entryNamespace, path } = splitResourceLocation(item.id, defaultNamespace);
          const namespace = entryNamespace || defaultNamespace;
          if (!path) { warnings.push(`nbt: invalid id "${item.id}"`); return; }
          const filePath = `${prefix}data/${namespace}/structure/${path}.nbt`;
          zip.file(filePath, item.data);
        });
      };

      for (const [layerName, layer] of Object.entries(layers)) {
        const prefix = layerName === 'data' ? '' : `${layerName}/`;
        for (const type of WORLDGEN_TYPES) {
          addEntries(prefix, type, layer[type] || []);
        }
        for (const type of DATAPACK_TYPES) {
          addDatapackEntries(prefix, type, layer[type] || []);
        }
        addTags(prefix, layer.tag || []);
        addFunctions(prefix, layer.function || []);
        addNbtFiles(prefix, layer.nbt || []);
        // Write passthrough files
        for (const pt of layer._passthrough || []) {
          zip.file(pt.path, pt.data);
        }
      }

      // Write pack.png
      if (packPng) {
        zip.file('pack.png', packPng);
      }

      // Write root-level passthrough files
      for (const pt of rootPassthrough) {
        zip.file(pt.path, pt.data);
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

  const handleAddPassthrough = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const defaultPath = file.name;
      const path = prompt('Enter path for file (e.g. assets/minecraft/textures/item/diamond.png):', defaultPath);
      if (path) {
        setLayers((prev) => {
          const layer = prev[activeLayer] || createEmptyLayer();
          const oldPt = layer._passthrough || [];
          return {
            ...prev,
            [activeLayer]: {
              ...layer,
              _passthrough: [...oldPt, { path, data }]
            }
          };
        });
      }
    } catch (error) {
      console.error('Failed to read file', error);
      alert('Failed to read file');
    }
    e.target.value = '';
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
                    {item.id !== 'metadata' && item.id !== 'passthrough' && (
                      <span className="app__nav-item-count">{(currentLayer[item.id] || []).length}</span>
                    )}
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

              <Card title="Pack Icon" className="app__meta-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  {packPng ? (
                    <img
                      src={URL.createObjectURL(new Blob([packPng], { type: 'image/png' }))}
                      alt="Pack icon"
                      style={{ width: 64, height: 64, imageRendering: 'pixelated', borderRadius: '4px', border: '1px solid var(--ui-border-subtle)' }}
                    />
                  ) : (
                    <div style={{ width: 64, height: 64, borderRadius: '4px', border: '1px dashed var(--ui-border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ui-text-muted)', fontSize: '11px' }}>
                      No icon
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      ref={iconInputRef}
                      type="file"
                      accept="image/png"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) setPackPng(await file.arrayBuffer());
                        e.target.value = '';
                      }}
                    />
                    <Button variant="secondary" size="sm" icon={<Upload size={14} />} onClick={() => iconInputRef.current?.click()}>
                      {packPng ? 'Replace' : 'Upload'} icon
                    </Button>
                    {packPng && (
                      <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setPackPng(null)}>
                        Remove icon
                      </Button>
                    )}
                    <span style={{ fontSize: '11px', color: 'var(--ui-text-muted)' }}>PNG, typically 64x64 or 128x128</span>
                  </div>
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

          <TabPanel id="loot_table" activeTab={activeEditor}>
            {renderCollection({
              title: 'Loot Tables',
              type: 'loot_table',
              defaultId: makeDefaultId('custom_loot_table'),
              defaultData: () => ({ type: 'minecraft:empty', pools: [] }),
              renderEditor: (entry, index) => (
                <LootTableEditor
                  value={entry.data}
                  {...makeEditorProps('loot_table')}
                  id={toDisplayId(entry.id)}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="recipe" activeTab={activeEditor}>
            {renderCollection({
              title: 'Recipes',
              type: 'recipe',
              defaultId: makeDefaultId('custom_recipe'),
              defaultData: () => ({ type: 'minecraft:crafting_shapeless', ingredients: [], result: { item: 'minecraft:stone' } }),
              renderEditor: (entry, index) => (
                <RecipeEditor
                  value={entry.data}
                  {...makeEditorProps('recipe')}
                  id={toDisplayId(entry.id)}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="advancement" activeTab={activeEditor}>
            {renderCollection({
              title: 'Advancements',
              type: 'advancement',
              defaultId: makeDefaultId('custom_advancement'),
              defaultData: () => ({ criteria: {} }),
              renderEditor: (entry, index) => (
                <AdvancementEditor
                  value={entry.data}
                  {...makeEditorProps('advancement')}
                  id={toDisplayId(entry.id)}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="predicate" activeTab={activeEditor}>
            {renderCollection({
              title: 'Predicates',
              type: 'predicate',
              defaultId: makeDefaultId('custom_predicate'),
              defaultData: () => ({ condition: 'minecraft:random_chance', chance: 0.5 }),
              renderEditor: (entry, index) => (
                <PredicateEditor
                  value={entry.data}
                  {...makeEditorProps('predicate')}
                  id={toDisplayId(entry.id)}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="item_modifier" activeTab={activeEditor}>
            {renderCollection({
              title: 'Item Modifiers',
              type: 'item_modifier',
              defaultId: makeDefaultId('custom_item_modifier'),
              defaultData: () => ({ function: 'minecraft:set_count', count: 1 }),
              renderEditor: (entry, index) => (
                <ItemModifierEditor
                  value={entry.data}
                  {...makeEditorProps('item_modifier')}
                  id={toDisplayId(entry.id)}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="dimension_type" activeTab={activeEditor}>
            {renderCollection({
              title: 'Dimension Types',
              type: 'dimension_type',
              defaultId: makeDefaultId('custom_dimension_type'),
              defaultData: () => ({
                ultrawarm: false, natural: true, piglin_safe: false,
                respawn_anchor_works: false, bed_works: true, has_raids: true,
                has_skylight: true, has_ceiling: false, coordinate_scale: 1.0,
                ambient_light: 0.0, logical_height: 384, effects: 'minecraft:overworld',
                infiniburn: '#minecraft:infiniburn_overworld', min_y: -64, height: 384,
                monster_spawn_light_level: 0, monster_spawn_block_light_limit: 0
              }),
              renderEditor: (entry, index) => (
                <DimensionTypeEditor
                  value={entry.data}
                  onChange={(data) => setItems('dimension_type', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setItems('dimension_type', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="damage_type" activeTab={activeEditor}>
            {renderCollection({
              title: 'Damage Types',
              type: 'damage_type',
              defaultId: makeDefaultId('custom_damage_type'),
              defaultData: () => ({ message_id: 'custom', exhaustion: 0.0, scaling: 'when_caused_by_living_non_player' }),
              renderEditor: (entry, index) => (
                <DamageTypeEditor
                  value={entry.data}
                  onChange={(data) => setItems('damage_type', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setItems('damage_type', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="chat_type" activeTab={activeEditor}>
            {renderCollection({
              title: 'Chat Types',
              type: 'chat_type',
              defaultId: makeDefaultId('custom_chat_type'),
              defaultData: () => ({
                chat: { translation_key: 'chat.type.text', parameters: ['sender', 'content'] },
                narration: { translation_key: 'chat.type.text.narrate', parameters: ['sender', 'content'] }
              }),
              renderEditor: (entry, index) => (
                <ChatTypeEditor
                  value={entry.data}
                  onChange={(data) => setItems('chat_type', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setItems('chat_type', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="function" activeTab={activeEditor}>
            {renderCollection({
              title: 'Functions',
              type: 'function',
              defaultId: makeDefaultId('custom_function'),
              defaultData: () => '# Commands here\n',
              renderEditor: (entry, index) => (
                <FunctionEditor
                  value={entry.data}
                  onChange={(data) => setItems('function', (prev) => updateItem(prev, index, { data }))}
                  id={toDisplayId(entry.id)}
                  onIdChange={(id) => setItems('function', (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                />
              )
            })}
          </TabPanel>

          <TabPanel id="nbt" activeTab={activeEditor}>
            <NbtManager
              items={getItems('nbt')}
              onAdd={(item) => {
                const ns = packMeta.namespace.trim() || 'custom';
                setItems('nbt', (prev) => {
                  const id = makeUniqueId(`${ns}:${item.id}`, prev);
                  return [...prev, { id, data: item.data }];
                });
              }}
              onRemove={(index) => {
                setItems('nbt', (prev) => prev.filter((_, i) => i !== index));
              }}
            />
          </TabPanel>

          {DATAPACK_TYPES.filter((t) => !['dimension', 'loot_table', 'recipe', 'advancement', 'predicate', 'item_modifier', 'dimension_type', 'damage_type', 'chat_type'].includes(t)).map((type) => (
            <TabPanel key={type} id={type} activeTab={activeEditor}>
              {renderCollection({
                title: labelMap[type] + 's',
                type,
                defaultId: makeDefaultId(`custom_${type}`),
                defaultData: () => ({}),
                renderEditor: (entry, index) => (
                  <GenericRegistryEditor
                    value={entry.data}
                    onChange={(data) => setItems(type, (prev) => updateItem(prev, index, { data }))}
                    id={toDisplayId(entry.id)}
                    onIdChange={(id) => setItems(type, (prev) => updateItem(prev, index, { id: fromDisplayId(id) }))}
                    typeName={labelMap[type]}
                  />
                )
              })}
            </TabPanel>
          ))}

          <TabPanel id="passthrough" activeTab={activeEditor}>
            <Card title="Other Files" className="passthrough-panel">
              <p style={{ color: 'var(--ui-text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                Files that don't match any known datapack category. These are preserved as-is during import/export.
              </p>
              <div style={{ marginBottom: '16px' }}>
                <input
                  ref={passthroughInputRef}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleAddPassthrough}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => passthroughInputRef.current?.click()}
                >
                  Add File to {activeLayer === 'data' ? 'data/' : `${activeLayer}/`}
                </Button>
              </div>

              {(() => {
                const allPtLen = rootPassthrough.length + layerNames.reduce((acc, name) => acc + (layers[name]._passthrough?.length || 0), 0);
                if (allPtLen === 0) {
                  return <p style={{ color: 'var(--ui-text-muted)', fontStyle: 'italic' }}>No other files.</p>;
                }
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {rootPassthrough.length > 0 && (
                      <>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ui-text-muted)', padding: '6px 0 2px' }}>Root files</div>
                        {rootPassthrough.map((pt, i) => (
                          <div key={`root-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '4px', background: 'var(--ui-bg-subtle, #f5f5f5)', fontSize: '13px', fontFamily: 'monospace' }}>
                            <span>{pt.path}</span>
                            <span style={{ color: 'var(--ui-text-muted)', fontSize: '11px', marginLeft: '12px', whiteSpace: 'nowrap' }}>{pt.data.byteLength != null ? `${(pt.data.byteLength / 1024).toFixed(1)} KB` : ''}</span>
                          </div>
                        ))}
                      </>
                    )}
                    {layerNames.map((layerName) => {
                      const layerFiles = layers[layerName]._passthrough || [];
                      if (layerFiles.length === 0) return null;
                      return (
                        <div key={layerName} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ui-text-muted)', padding: '6px 0 2px' }}>Layer: {layerName === 'data' ? 'data/' : `${layerName}/`}</div>
                          {layerFiles.map((pt, i) => (
                            <div key={`layer-${layerName}-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '4px', background: 'var(--ui-bg-subtle, #f5f5f5)', fontSize: '13px', fontFamily: 'monospace' }}>
                              <span>{pt.path}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ color: 'var(--ui-text-muted)', fontSize: '11px', whiteSpace: 'nowrap' }}>{pt.data.byteLength != null ? `${(pt.data.byteLength / 1024).toFixed(1)} KB` : ''}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={<X size={14} />}
                                  onClick={() => {
                                    if (confirm(`Remove file "${pt.path}"?`)) {
                                      setLayers(prev => {
                                        const l = prev[layerName];
                                        if (!l) return prev;
                                        const newPt = l._passthrough.filter((_, idx) => idx !== i);
                                        return { ...prev, [layerName]: { ...l, _passthrough: newPt } };
                                      });
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </Card>
          </TabPanel>
        </section>
      </main>
    </div >
  );
}
