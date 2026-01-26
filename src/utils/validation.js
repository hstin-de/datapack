/**
 * Schema Validation System using AJV
 * Provides real-time validation for all worldgen types
 */

import Ajv from 'ajv';
import { schemas, getSchema } from './schemas.js';
import { isValidResourceLocation, isValidRegistryEntry, REGISTRIES } from './vanilla-registry.js';

// Initialize AJV with all schemas
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: false,
  allowUnionTypes: true
});

// Compile all schemas
const validators = {};
for (const [type, schema] of Object.entries(schemas)) {
  try {
    validators[type] = ajv.compile(schema);
  } catch (err) {
    console.warn(`Failed to compile schema for ${type}:`, err.message);
  }
}

/**
 * Validate data against a worldgen type schema
 * @param {string} type - The worldgen type (e.g., 'biome', 'configured_feature')
 * @param {object} data - The data to validate
 * @returns {{ valid: boolean, errors: Array<ValidationError> }}
 */
export function validate(type, data) {
  const validator = validators[type];
  if (!validator) {
    return {
      valid: false,
      errors: [{ path: '', message: `Unknown worldgen type: ${type}` }]
    };
  }

  const valid = validator(data);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = (validator.errors || []).map(err => ({
    path: err.instancePath || '',
    message: formatErrorMessage(err),
    keyword: err.keyword,
    params: err.params
  }));

  return { valid: false, errors };
}

/**
 * Format AJV error message to be more user-friendly
 */
function formatErrorMessage(error) {
  switch (error.keyword) {
    case 'required':
      return `Missing required field: ${error.params.missingProperty}`;
    case 'type':
      return `Expected ${error.params.type}, got ${typeof error.data}`;
    case 'enum':
      return `Must be one of: ${error.params.allowedValues.join(', ')}`;
    case 'minimum':
      return `Must be at least ${error.params.limit}`;
    case 'maximum':
      return `Must be at most ${error.params.limit}`;
    case 'minItems':
      return `Must have at least ${error.params.limit} items`;
    case 'maxItems':
      return `Must have at most ${error.params.limit} items`;
    case 'pattern':
      return `Invalid format`;
    case 'additionalProperties':
      return `Unknown property: ${error.params.additionalProperty}`;
    case 'oneOf':
      return `Must match exactly one of the allowed formats`;
    default:
      return error.message || 'Validation error';
  }
}

/**
 * Validate a resource location string
 * @param {string} value - The resource location to validate
 * @param {object} options - Validation options
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateResourceLocation(value, options = {}) {
  const { allowTags = true, registry = null, allowEmpty = false } = options;

  if (!value) {
    if (allowEmpty) return { valid: true };
    return { valid: false, error: 'Resource location is required' };
  }

  if (typeof value !== 'string') {
    return { valid: false, error: 'Must be a string' };
  }

  const isTag = value.startsWith('#');
  if (isTag && !allowTags) {
    return { valid: false, error: 'Tags are not allowed here' };
  }

  if (!isValidResourceLocation(value)) {
    return { valid: false, error: 'Invalid format. Expected namespace:path' };
  }

  // Check against registry if specified
  if (registry && !isTag) {
    const entries = REGISTRIES[registry];
    if (entries && !entries.includes(value)) {
      // Not a fatal error, just a warning - custom entries are allowed
      return { valid: true, warning: `Not a known ${registry} entry` };
    }
  }

  return { valid: true };
}

/**
 * Validate a block state object
 * @param {object} blockState - The block state to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateBlockState(blockState) {
  const errors = [];

  if (!blockState || typeof blockState !== 'object') {
    return { valid: false, errors: [{ path: '', message: 'Block state must be an object' }] };
  }

  if (!blockState.Name) {
    errors.push({ path: '/Name', message: 'Block name is required' });
  } else if (!isValidResourceLocation(blockState.Name)) {
    errors.push({ path: '/Name', message: 'Invalid block name format' });
  }

  if (blockState.Properties) {
    if (typeof blockState.Properties !== 'object') {
      errors.push({ path: '/Properties', message: 'Properties must be an object' });
    } else {
      for (const [key, value] of Object.entries(blockState.Properties)) {
        if (typeof value !== 'string') {
          errors.push({ path: `/Properties/${key}`, message: 'Property value must be a string' });
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an int provider value
 * @param {*} value - The int provider to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateIntProvider(value) {
  const errors = [];

  if (typeof value === 'number') {
    if (!Number.isInteger(value)) {
      errors.push({ path: '', message: 'Must be an integer' });
    }
    return { valid: errors.length === 0, errors };
  }

  if (typeof value !== 'object' || value === null) {
    return { valid: false, errors: [{ path: '', message: 'Must be an integer or an object' }] };
  }

  const validTypes = ['minecraft:constant', 'minecraft:uniform', 'minecraft:biased_to_bottom', 'minecraft:clamped', 'minecraft:clamped_normal', 'minecraft:weighted_list'];

  if (!value.type) {
    errors.push({ path: '/type', message: 'Type is required' });
  } else if (!validTypes.includes(value.type)) {
    errors.push({ path: '/type', message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a float provider value
 * @param {*} value - The float provider to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateFloatProvider(value) {
  const errors = [];

  if (typeof value === 'number') {
    return { valid: true, errors: [] };
  }

  if (typeof value !== 'object' || value === null) {
    return { valid: false, errors: [{ path: '', message: 'Must be a number or an object' }] };
  }

  const validTypes = ['minecraft:constant', 'minecraft:uniform', 'minecraft:clamped_normal', 'minecraft:trapezoid'];

  if (!value.type) {
    errors.push({ path: '/type', message: 'Type is required' });
  } else if (!validTypes.includes(value.type)) {
    errors.push({ path: '/type', message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a height provider value
 * @param {*} value - The height provider to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateHeightProvider(value) {
  const errors = [];

  if (typeof value !== 'object' || value === null) {
    return { valid: false, errors: [{ path: '', message: 'Must be an object' }] };
  }

  // Check if it's a vertical anchor
  if ('absolute' in value || 'above_bottom' in value || 'below_top' in value) {
    const anchorKeys = ['absolute', 'above_bottom', 'below_top'].filter(k => k in value);
    if (anchorKeys.length !== 1) {
      errors.push({ path: '', message: 'Vertical anchor must have exactly one of: absolute, above_bottom, below_top' });
    }
    return { valid: errors.length === 0, errors };
  }

  // Check height provider type
  const validTypes = ['minecraft:constant', 'minecraft:uniform', 'minecraft:biased_to_bottom', 'minecraft:very_biased_to_bottom', 'minecraft:trapezoid', 'minecraft:weighted_list'];

  if (!value.type) {
    errors.push({ path: '/type', message: 'Type is required for height provider' });
  } else if (!validTypes.includes(value.type)) {
    errors.push({ path: '/type', message: `Invalid type. Must be one of: ${validTypes.join(', ')}` });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a vertical anchor value
 * @param {*} value - The vertical anchor to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateVerticalAnchor(value) {
  const errors = [];

  if (typeof value !== 'object' || value === null) {
    return { valid: false, errors: [{ path: '', message: 'Must be an object' }] };
  }

  const anchorKeys = ['absolute', 'above_bottom', 'below_top'].filter(k => k in value);

  if (anchorKeys.length === 0) {
    errors.push({ path: '', message: 'Must have one of: absolute, above_bottom, below_top' });
  } else if (anchorKeys.length > 1) {
    errors.push({ path: '', message: 'Must have only one of: absolute, above_bottom, below_top' });
  } else {
    const key = anchorKeys[0];
    if (!Number.isInteger(value[key])) {
      errors.push({ path: `/${key}`, message: 'Must be an integer' });
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate a spawner entry
 * @param {object} spawner - The spawner entry to validate
 * @returns {{ valid: boolean, errors: Array }}
 */
export function validateSpawnerEntry(spawner) {
  const errors = [];

  if (!spawner || typeof spawner !== 'object') {
    return { valid: false, errors: [{ path: '', message: 'Spawner entry must be an object' }] };
  }

  if (!spawner.type) {
    errors.push({ path: '/type', message: 'Entity type is required' });
  } else if (!isValidResourceLocation(spawner.type)) {
    errors.push({ path: '/type', message: 'Invalid entity type format' });
  }

  if (typeof spawner.weight !== 'number' || spawner.weight < 0) {
    errors.push({ path: '/weight', message: 'Weight must be a non-negative number' });
  }

  if (typeof spawner.minCount !== 'number' || spawner.minCount < 0) {
    errors.push({ path: '/minCount', message: 'Min count must be a non-negative number' });
  }

  if (typeof spawner.maxCount !== 'number' || spawner.maxCount < 0) {
    errors.push({ path: '/maxCount', message: 'Max count must be a non-negative number' });
  }

  if (spawner.minCount > spawner.maxCount) {
    errors.push({ path: '/minCount', message: 'Min count cannot exceed max count' });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate color value (RGB integer or hex)
 * @param {*} value - The color value
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateColor(value) {
  if (typeof value === 'number') {
    if (!Number.isInteger(value) || value < 0 || value > 16777215) {
      return { valid: false, error: 'Color must be an integer between 0 and 16777215' };
    }
    return { valid: true };
  }
  return { valid: false, error: 'Color must be an integer' };
}

/**
 * Create a field validator function for use with UI components
 * @param {Function} validateFn - The validation function
 * @param {object} options - Options to pass to the validation function
 * @returns {Function} A validator function that returns error string or null
 */
export function createFieldValidator(validateFn, options = {}) {
  return (value) => {
    const result = validateFn(value, options);
    if (result.valid) return null;
    if (result.error) return result.error;
    if (result.errors && result.errors.length > 0) {
      return result.errors[0].message;
    }
    return 'Invalid value';
  };
}

/**
 * Resource location validator for form fields
 */
export const resourceLocationValidator = createFieldValidator(validateResourceLocation);

/**
 * Block name validator
 */
export const blockNameValidator = createFieldValidator(
  (value) => validateResourceLocation(value, { allowTags: false, registry: 'block' })
);

/**
 * Biome reference validator
 */
export const biomeValidator = createFieldValidator(
  (value) => validateResourceLocation(value, { allowTags: true })
);

/**
 * Entity type validator
 */
export const entityTypeValidator = createFieldValidator(
  (value) => validateResourceLocation(value, { allowTags: false, registry: 'entity_type' })
);

/**
 * Validate entire biome data
 */
export function validateBiome(data) {
  return validate('biome', data);
}

/**
 * Validate configured feature data
 */
export function validateConfiguredFeature(data) {
  return validate('configured_feature', data);
}

/**
 * Validate placed feature data
 */
export function validatePlacedFeature(data) {
  return validate('placed_feature', data);
}

/**
 * Validate configured carver data
 */
export function validateConfiguredCarver(data) {
  return validate('configured_carver', data);
}

/**
 * Validate structure data
 */
export function validateStructure(data) {
  return validate('structure', data);
}

/**
 * Validate structure set data
 */
export function validateStructureSet(data) {
  return validate('structure_set', data);
}

/**
 * Validate noise settings data
 */
export function validateNoiseSettings(data) {
  return validate('noise_settings', data);
}

/**
 * Validate noise data
 */
export function validateNoise(data) {
  return validate('noise', data);
}

/**
 * Validate density function data
 */
export function validateDensityFunction(data) {
  return validate('density_function', data);
}

/**
 * Validate dimension data
 */
export function validateDimension(data) {
  return validate('dimension', data);
}

/**
 * Validate template pool data
 */
export function validateTemplatePool(data) {
  return validate('template_pool', data);
}

/**
 * Validate processor list data
 */
export function validateProcessorList(data) {
  return validate('processor_list', data);
}

/**
 * Validate world preset data
 */
export function validateWorldPreset(data) {
  return validate('world_preset', data);
}

/**
 * Validate flat level generator preset data
 */
export function validateFlatLevelGeneratorPreset(data) {
  return validate('flat_level_generator_preset', data);
}

/**
 * Validate dimension type data
 */
export function validateDimensionType(data) {
  return validate('dimension_type', data);
}

/**
 * Validate tag data
 */
export function validateTag(data) {
  return validate('tag', data);
}

/**
 * Validate pack.mcmeta data
 */
export function validatePackMcmeta(data) {
  return validate('pack_mcmeta', data);
}

// Export everything
export {
  ajv,
  validators,
  schemas
};
