/**
 * JSON Schemas for Minecraft Worldgen Data Types
 * Based on Minecraft 1.21+ data-driven worldgen format
 */

// Common schema definitions used across multiple types
const resourceLocation = {
  type: 'string',
  pattern: '^[a-z0-9_.-]+:[a-z0-9_./=-]+$'
};

const tagReference = {
  type: 'string',
  pattern: '^#[a-z0-9_.-]+:[a-z0-9_./=-]+$'
};

const textComponent = {
  type: 'object',
  properties: {
    text: { type: 'string' },
    color: { type: 'string' },
    font: { type: 'string' },
    bold: { type: 'boolean' },
    italic: { type: 'boolean' },
    underlined: { type: 'boolean' },
    strikethrough: { type: 'boolean' },
    obfuscated: { type: 'boolean' },
    insertion: { type: 'string' },
    clickEvent: {
      type: 'object',
      properties: {
        action: { type: 'string' },
        value: {}
      },
      required: ['action', 'value']
    },
    hoverEvent: {
      type: 'object',
      properties: {
        action: { type: 'string' },
        value: {}
      },
      required: ['action', 'value']
    },
    extra: {
      type: 'array',
      items: {}
    }
  },
  additionalProperties: true
};

const descriptionField = {
  oneOf: [
    { type: 'string' },
    textComponent,
    {
      type: 'array',
      items: textComponent
    }
  ]
};

const blockState = {
  type: 'object',
  properties: {
    Name: { type: 'string' },
    Properties: {
      type: 'object',
      additionalProperties: { type: 'string' }
    }
  },
  required: ['Name']
};

const verticalAnchor = {
  oneOf: [
    {
      type: 'object',
      properties: { absolute: { type: 'integer' } },
      required: ['absolute'],
      additionalProperties: false
    },
    {
      type: 'object',
      properties: { above_bottom: { type: 'integer' } },
      required: ['above_bottom'],
      additionalProperties: false
    },
    {
      type: 'object',
      properties: { below_top: { type: 'integer' } },
      required: ['below_top'],
      additionalProperties: false
    }
  ]
};

const intProvider = {
  oneOf: [
    { type: 'integer' },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:constant'] },
        value: { type: 'integer' }
      },
      required: ['type', 'value']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:uniform'] },
        min_inclusive: { type: 'integer' },
        max_inclusive: { type: 'integer' }
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:biased_to_bottom'] },
        min_inclusive: { type: 'integer' },
        max_inclusive: { type: 'integer' }
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:clamped'] },
        source: { $ref: '#/definitions/intProvider' },
        min_inclusive: { type: 'integer' },
        max_inclusive: { type: 'integer' }
      },
      required: ['type', 'source', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:clamped_normal'] },
        mean: { type: 'number' },
        deviation: { type: 'number' },
        min_inclusive: { type: 'integer' },
        max_inclusive: { type: 'integer' }
      },
      required: ['type', 'mean', 'deviation', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:weighted_list'] },
        distribution: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              weight: { type: 'integer', minimum: 1 },
              data: { $ref: '#/definitions/intProvider' }
            },
            required: ['weight', 'data']
          }
        }
      },
      required: ['type', 'distribution']
    }
  ]
};

const floatProvider = {
  oneOf: [
    { type: 'number' },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:constant'] },
        value: { type: 'number' }
      },
      required: ['type', 'value']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:uniform'] },
        min_inclusive: { type: 'number' },
        max_exclusive: { type: 'number' }
      },
      required: ['type', 'min_inclusive', 'max_exclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:clamped_normal'] },
        mean: { type: 'number' },
        deviation: { type: 'number' },
        min: { type: 'number' },
        max: { type: 'number' }
      },
      required: ['type', 'mean', 'deviation', 'min', 'max']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:trapezoid'] },
        min: { type: 'number' },
        max: { type: 'number' },
        plateau: { type: 'number' }
      },
      required: ['type', 'min', 'max']
    }
  ]
};

const heightProvider = {
  oneOf: [
    verticalAnchor,
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:constant'] },
        value: verticalAnchor
      },
      required: ['type', 'value']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:uniform'] },
        min_inclusive: verticalAnchor,
        max_inclusive: verticalAnchor
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:biased_to_bottom'] },
        min_inclusive: verticalAnchor,
        max_inclusive: verticalAnchor,
        inner: { type: 'integer', minimum: 1 }
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:very_biased_to_bottom'] },
        min_inclusive: verticalAnchor,
        max_inclusive: verticalAnchor,
        inner: { type: 'integer', minimum: 1 }
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:trapezoid'] },
        min_inclusive: verticalAnchor,
        max_inclusive: verticalAnchor,
        plateau: { type: 'integer' }
      },
      required: ['type', 'min_inclusive', 'max_inclusive']
    },
    {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['minecraft:weighted_list'] },
        distribution: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              weight: { type: 'integer', minimum: 1 },
              data: { $ref: '#/definitions/heightProvider' }
            },
            required: ['weight', 'data']
          }
        }
      },
      required: ['type', 'distribution']
    }
  ]
};

// Biome Schema
export const biomeSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    temperature: { type: 'number' },
    downfall: { type: 'number', minimum: 0, maximum: 1 },
    has_precipitation: { type: 'boolean' },
    temperature_modifier: { type: 'string', enum: ['none', 'frozen'] },
    creature_spawn_probability: { type: 'number', minimum: 0, maximum: 1 },
    effects: {
      type: 'object',
      properties: {
        fog_color: { type: 'integer' },
        water_color: { type: 'integer' },
        water_fog_color: { type: 'integer' },
        sky_color: { type: 'integer' },
        foliage_color: { type: 'integer' },
        grass_color: { type: 'integer' },
        grass_color_modifier: { type: 'string', enum: ['none', 'dark_forest', 'swamp'] },
        particle: {
          type: 'object',
          properties: {
            options: {
              type: 'object',
              properties: {
                type: resourceLocation
              },
              required: ['type']
            },
            probability: { type: 'number', minimum: 0, maximum: 1 }
          },
          required: ['options', 'probability']
        },
        ambient_sound: resourceLocation,
        mood_sound: {
          type: 'object',
          properties: {
            sound: resourceLocation,
            tick_delay: { type: 'integer', minimum: 0 },
            block_search_extent: { type: 'integer', minimum: 0 },
            offset: { type: 'number' }
          },
          required: ['sound', 'tick_delay', 'block_search_extent', 'offset']
        },
        additions_sound: {
          type: 'object',
          properties: {
            sound: resourceLocation,
            tick_chance: { type: 'number', minimum: 0, maximum: 1 }
          },
          required: ['sound', 'tick_chance']
        },
        music: {
          oneOf: [
            {
              type: 'object',
              properties: {
                sound: resourceLocation,
                min_delay: { type: 'integer', minimum: 0 },
                max_delay: { type: 'integer', minimum: 0 },
                replace_current_music: { type: 'boolean' }
              },
              required: ['sound', 'min_delay', 'max_delay', 'replace_current_music']
            },
            {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  weight: { type: 'integer', minimum: 1 },
                  data: {
                    type: 'object',
                    properties: {
                      sound: resourceLocation,
                      min_delay: { type: 'integer', minimum: 0 },
                      max_delay: { type: 'integer', minimum: 0 },
                      replace_current_music: { type: 'boolean' }
                    },
                    required: ['sound', 'min_delay', 'max_delay', 'replace_current_music']
                  }
                },
                required: ['weight', 'data']
              }
            }
          ]
        },
        music_volume: { type: 'number', minimum: 0, maximum: 1 }
      },
      required: ['fog_color', 'water_color', 'water_fog_color', 'sky_color']
    },
    spawners: {
      type: 'object',
      properties: {
        monster: { $ref: '#/definitions/spawnerList' },
        creature: { $ref: '#/definitions/spawnerList' },
        ambient: { $ref: '#/definitions/spawnerList' },
        axolotls: { $ref: '#/definitions/spawnerList' },
        underground_water_creature: { $ref: '#/definitions/spawnerList' },
        water_creature: { $ref: '#/definitions/spawnerList' },
        water_ambient: { $ref: '#/definitions/spawnerList' },
        misc: { $ref: '#/definitions/spawnerList' }
      },
      additionalProperties: false
    },
    spawn_costs: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          energy_budget: { type: 'number' },
          charge: { type: 'number' }
        },
        required: ['energy_budget', 'charge']
      }
    },
    carvers: {
      oneOf: [
        resourceLocation,
        {
          type: 'array',
          items: resourceLocation
        },
        {
          type: 'object',
          properties: {
            air: {
              type: 'array',
              items: resourceLocation
            },
            liquid: {
              type: 'array',
              items: resourceLocation
            }
          },
          additionalProperties: false
        }
      ]
    },
    features: {
      type: 'array',
      items: {
        type: 'array',
        items: resourceLocation
      },
      maxItems: 11
    }
  },
  required: [
    'temperature',
    'downfall',
    'effects',
    'spawners',
    'features',
    'carvers',
    'has_precipitation',
    'spawn_costs'
  ],
  definitions: {
    spawnerList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: resourceLocation,
          weight: { type: 'integer', minimum: 0 },
          minCount: { type: 'integer', minimum: 0 },
          maxCount: { type: 'integer', minimum: 0 }
        },
        required: ['type', 'weight', 'minCount', 'maxCount']
      }
    }
  }
};

// Configured Feature Schema
export const configuredFeatureSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    type: resourceLocation,
    config: { type: 'object' }
  },
  required: ['type'],
  definitions: {
    intProvider,
    floatProvider,
    blockState,
    resourceLocation
  }
};

// Placed Feature Schema
export const placedFeatureSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    feature: resourceLocation,
    placement: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: resourceLocation
        },
        required: ['type']
      }
    }
  },
  required: ['feature', 'placement'],
  definitions: {
    heightProvider,
    verticalAnchor,
    intProvider
  }
};

// Configured Carver Schema
export const configuredCarverSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['minecraft:cave', 'minecraft:nether_cave', 'minecraft:canyon']
    },
    config: {
      type: 'object',
      properties: {
        probability: { type: 'number', minimum: 0, maximum: 1 },
        y: { $ref: '#/definitions/heightProvider' },
        yScale: { $ref: '#/definitions/floatProvider' },
        lava_level: { $ref: '#/definitions/verticalAnchor' },
        replaceable: {
          oneOf: [resourceLocation, tagReference]
        },
        horizontal_radius_multiplier: { $ref: '#/definitions/floatProvider' },
        vertical_radius_multiplier: { $ref: '#/definitions/floatProvider' },
        floor_level: { $ref: '#/definitions/floatProvider' },
        // Canyon specific
        vertical_rotation: { $ref: '#/definitions/floatProvider' },
        shape: {
          type: 'object',
          properties: {
            distance_factor: { $ref: '#/definitions/floatProvider' },
            thickness: { $ref: '#/definitions/floatProvider' },
            width_smoothness: { type: 'integer' },
            horizontal_radius_factor: { $ref: '#/definitions/floatProvider' },
            vertical_radius_default_factor: { type: 'number' },
            vertical_radius_center_factor: { type: 'number' }
          }
        },
        debug_settings: {
          type: 'object',
          properties: {
            debug_mode: { type: 'boolean' },
            air_state: blockState,
            water_state: blockState,
            lava_state: blockState,
            barrier_state: blockState
          }
        }
      },
      required: ['probability', 'y', 'yScale', 'lava_level']
    }
  },
  required: ['type', 'config'],
  definitions: {
    heightProvider,
    floatProvider,
    verticalAnchor,
    blockState
  }
};

// Structure Schema
export const structureSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    type: resourceLocation,
    biomes: {
      oneOf: [
        resourceLocation,
        tagReference,
        { type: 'array', items: resourceLocation }
      ]
    },
    step: {
      type: 'string',
      enum: [
        'raw_generation', 'lakes', 'local_modifications', 'underground_structures',
        'surface_structures', 'strongholds', 'underground_ores', 'underground_decoration',
        'fluid_springs', 'vegetal_decoration', 'top_layer_modification'
      ]
    },
    terrain_adaptation: {
      type: 'string',
      enum: ['none', 'bury', 'beard_thin', 'beard_box', 'encapsulate']
    },
    spawn_overrides: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          bounding_box: { type: 'string', enum: ['piece', 'full'] },
          spawns: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: resourceLocation,
                weight: { type: 'integer', minimum: 0 },
                minCount: { type: 'integer', minimum: 0 },
                maxCount: { type: 'integer', minimum: 0 }
              },
              required: ['type', 'weight', 'minCount', 'maxCount']
            }
          }
        },
        required: ['bounding_box', 'spawns']
      }
    },
    // Jigsaw specific
    start_pool: resourceLocation,
    size: { type: 'integer', minimum: 0, maximum: 20 },
    start_height: { $ref: '#/definitions/heightProvider' },
    start_jigsaw_name: { type: 'string' },
    project_start_to_heightmap: {
      type: 'string',
      enum: ['WORLD_SURFACE_WG', 'WORLD_SURFACE', 'OCEAN_FLOOR_WG', 'OCEAN_FLOOR', 'MOTION_BLOCKING', 'MOTION_BLOCKING_NO_LEAVES']
    },
    max_distance_from_center: { type: 'integer', minimum: 1, maximum: 128 },
    use_expansion_hack: { type: 'boolean' }
  },
  required: ['type', 'biomes', 'step', 'spawn_overrides'],
  definitions: {
    heightProvider,
    verticalAnchor
  }
};

// Structure Set Schema
export const structureSetSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    structures: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          structure: resourceLocation,
          weight: { type: 'integer', minimum: 1 }
        },
        required: ['structure', 'weight']
      },
      minItems: 1
    },
    placement: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['minecraft:random_spread', 'minecraft:concentric_rings']
        },
        // Random spread properties
        spacing: { type: 'integer', minimum: 1 },
        separation: { type: 'integer', minimum: 0 },
        salt: { type: 'integer' },
        spread_type: { type: 'string', enum: ['linear', 'triangular'] },
        frequency: { type: 'number', minimum: 0, maximum: 1 },
        frequency_reduction_method: {
          type: 'string',
          enum: ['default', 'legacy_type_1', 'legacy_type_2', 'legacy_type_3']
        },
        exclusion_zone: {
          type: 'object',
          properties: {
            other_set: resourceLocation,
            chunk_count: { type: 'integer', minimum: 1 }
          },
          required: ['other_set', 'chunk_count']
        },
        locate_offset: {
          type: 'array',
          items: { type: 'integer' },
          minItems: 3,
          maxItems: 3
        },
        // Concentric rings properties
        distance: { type: 'integer', minimum: 0 },
        spread: { type: 'integer', minimum: 0 },
        count: { type: 'integer', minimum: 1 },
        preferred_biomes: {
          oneOf: [
            resourceLocation,
            tagReference
          ]
        }
      },
      required: ['type']
    }
  },
  required: ['structures', 'placement']
};

// Template Pool Schema
export const templatePoolSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    fallback: resourceLocation,
    elements: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          weight: { type: 'integer', minimum: 1 },
          element: {
            type: 'object',
            properties: {
              element_type: {
                type: 'string',
                enum: [
                  'minecraft:empty_pool_element',
                  'minecraft:feature_pool_element',
                  'minecraft:legacy_single_pool_element',
                  'minecraft:list_pool_element',
                  'minecraft:single_pool_element'
                ]
              },
              location: resourceLocation,
              projection: { type: 'string', enum: ['rigid', 'terrain_matching'] },
              processors: {
                oneOf: [
                  resourceLocation,
                  {
                    type: 'object',
                    properties: {
                      processors: { type: 'array' }
                    }
                  }
                ]
              }
            },
            required: ['element_type']
          }
        },
        required: ['weight', 'element']
      }
    }
  },
  required: ['fallback', 'elements']
};

// Processor List Schema
export const processorListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    processors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          processor_type: {
            type: 'string',
            enum: [
              'minecraft:block_age', 'minecraft:block_ignore', 'minecraft:block_rot',
              'minecraft:capped', 'minecraft:gravity', 'minecraft:jigsaw_replacement',
              'minecraft:lava_submerged_block', 'minecraft:nop', 'minecraft:protected_blocks',
              'minecraft:rule'
            ]
          }
        },
        required: ['processor_type']
      }
    }
  },
  required: ['processors']
};

// Noise Settings Schema
export const noiseSettingsSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    sea_level: { type: 'integer' },
    disable_mob_generation: { type: 'boolean' },
    aquifers_enabled: { type: 'boolean' },
    ore_veins_enabled: { type: 'boolean' },
    legacy_random_source: { type: 'boolean' },
    default_block: blockState,
    default_fluid: blockState,
    noise: {
      type: 'object',
      properties: {
        min_y: { type: 'integer' },
        height: { type: 'integer', minimum: 0 },
        size_horizontal: { type: 'integer', minimum: 1 },
        size_vertical: { type: 'integer', minimum: 1 }
      },
      required: ['min_y', 'height', 'size_horizontal', 'size_vertical']
    },
    noise_router: {
      type: 'object',
      properties: {
        barrier: { $ref: '#/definitions/densityFunction' },
        fluid_level_floodedness: { $ref: '#/definitions/densityFunction' },
        fluid_level_spread: { $ref: '#/definitions/densityFunction' },
        lava: { $ref: '#/definitions/densityFunction' },
        temperature: { $ref: '#/definitions/densityFunction' },
        vegetation: { $ref: '#/definitions/densityFunction' },
        continents: { $ref: '#/definitions/densityFunction' },
        erosion: { $ref: '#/definitions/densityFunction' },
        depth: { $ref: '#/definitions/densityFunction' },
        ridges: { $ref: '#/definitions/densityFunction' },
        initial_density_without_jaggedness: { $ref: '#/definitions/densityFunction' },
        final_density: { $ref: '#/definitions/densityFunction' },
        vein_toggle: { $ref: '#/definitions/densityFunction' },
        vein_ridged: { $ref: '#/definitions/densityFunction' },
        vein_gap: { $ref: '#/definitions/densityFunction' }
      }
    },
    spawn_target: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          temperature: { $ref: '#/definitions/climateParameter' },
          humidity: { $ref: '#/definitions/climateParameter' },
          continentalness: { $ref: '#/definitions/climateParameter' },
          erosion: { $ref: '#/definitions/climateParameter' },
          weirdness: { $ref: '#/definitions/climateParameter' },
          depth: { $ref: '#/definitions/climateParameter' },
          offset: { type: 'number' }
        }
      }
    },
    surface_rule: { $ref: '#/definitions/surfaceRule' }
  },
  required: ['sea_level', 'default_block', 'default_fluid', 'noise', 'noise_router'],
  definitions: {
    blockState,
    densityFunction: {
      oneOf: [
        { type: 'number' },
        { type: 'string' },
        {
          type: 'object',
          properties: {
            type: resourceLocation
          },
          required: ['type']
        }
      ]
    },
    climateParameter: {
      oneOf: [
        { type: 'number' },
        {
          type: 'array',
          items: { type: 'number' },
          minItems: 2,
          maxItems: 2
        }
      ]
    },
    surfaceRule: {
      type: 'object',
      properties: {
        type: resourceLocation
      },
      required: ['type']
    }
  }
};

// Density Function Schema
export const densityFunctionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  oneOf: [
    { type: 'number' },
    { type: 'string' },
    {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: [
            'minecraft:abs', 'minecraft:add', 'minecraft:beardifier', 'minecraft:blend_alpha',
            'minecraft:blend_density', 'minecraft:blend_offset', 'minecraft:cache_2d',
            'minecraft:cache_all_in_cell', 'minecraft:cache_once', 'minecraft:clamp',
            'minecraft:constant', 'minecraft:cube', 'minecraft:end_islands', 'minecraft:flat_cache',
            'minecraft:half_negative', 'minecraft:interpolated', 'minecraft:max', 'minecraft:min',
            'minecraft:mul', 'minecraft:noise', 'minecraft:old_blended_noise', 'minecraft:quarter_negative',
            'minecraft:range_choice', 'minecraft:shift', 'minecraft:shift_a', 'minecraft:shift_b',
            'minecraft:shifted_noise', 'minecraft:slide', 'minecraft:spline', 'minecraft:square',
            'minecraft:squeeze', 'minecraft:weird_scaled_sampler', 'minecraft:y_clamped_gradient'
          ]
        }
      },
      required: ['type']
    }
  ]
};

// Noise Schema
export const noiseSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    firstOctave: { type: 'integer' },
    amplitudes: {
      type: 'array',
      items: { type: 'number' },
      minItems: 1
    }
  },
  required: ['firstOctave', 'amplitudes']
};

const flatLevelGeneratorSettingsSchema = {
  type: 'object',
  properties: {
    biome: resourceLocation,
    features: { type: 'boolean' },
    lakes: { type: 'boolean' },
    layers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          block: resourceLocation,
          height: { type: 'integer', minimum: 0 }
        },
        required: ['block', 'height']
      }
    },
    structure_overrides: {
      oneOf: [
        resourceLocation,
        tagReference,
        {
          type: 'array',
          items: resourceLocation
        }
      ]
    }
  },
  required: ['biome', 'layers']
};

// Dimension Schema
export const dimensionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    type: resourceLocation,
    generator: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['minecraft:noise', 'minecraft:flat', 'minecraft:debug']
        },
        biome_source: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['minecraft:multi_noise', 'minecraft:fixed', 'minecraft:checkerboard', 'minecraft:the_end']
            },
            preset: resourceLocation,
            biome: resourceLocation,
            biomes: {
              type: 'array',
              items: resourceLocation
            },
            scale: { type: 'integer', minimum: 1 }
          },
          required: ['type']
        },
        settings: {
          oneOf: [
            resourceLocation,
            flatLevelGeneratorSettingsSchema
          ]
        }
      },
      required: ['type']
    }
  },
  required: ['type', 'generator']
};

// World Preset Schema
export const worldPresetSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    dimensions: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        properties: {
          type: resourceLocation,
          generator: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['minecraft:noise', 'minecraft:flat', 'minecraft:debug']
              },
              biome_source: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['minecraft:multi_noise', 'minecraft:fixed', 'minecraft:checkerboard', 'minecraft:the_end']
                  },
                  preset: resourceLocation,
                  biome: resourceLocation,
                  biomes: {
                    type: 'array',
                    items: resourceLocation
                  }
                },
                required: ['type']
              },
              settings: {
                oneOf: [
                  resourceLocation,
                  flatLevelGeneratorSettingsSchema
                ]
              }
            },
            required: ['type']
          }
        },
        required: ['type', 'generator']
      }
    }
  },
  required: ['dimensions']
};

// Flat Level Generator Preset Schema
export const flatLevelGeneratorPresetSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    display: resourceLocation,
    settings: flatLevelGeneratorSettingsSchema
  },
  required: ['display', 'settings']
};

// Dimension Type Schema
export const dimensionTypeSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    ultrawarm: { type: 'boolean' },
    natural: { type: 'boolean' },
    piglin_safe: { type: 'boolean' },
    respawn_anchor_works: { type: 'boolean' },
    bed_works: { type: 'boolean' },
    has_raids: { type: 'boolean' },
    has_skylight: { type: 'boolean' },
    has_ceiling: { type: 'boolean' },
    coordinate_scale: { type: 'number', minimum: 0.00001, maximum: 30000000 },
    ambient_light: { type: 'number', minimum: 0, maximum: 1 },
    fixed_time: { type: 'integer' },
    logical_height: { type: 'integer', minimum: 0, maximum: 4064 },
    effects: {
      type: 'string',
      enum: ['minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end']
    },
    infiniburn: tagReference,
    min_y: { type: 'integer', minimum: -2032, maximum: 2031 },
    height: { type: 'integer', minimum: 16, maximum: 4064 },
    monster_spawn_light_level: {
      oneOf: [
        { type: 'integer', minimum: 0, maximum: 15 },
        intProvider
      ]
    },
    monster_spawn_block_light_limit: { type: 'integer', minimum: 0, maximum: 15 }
  },
  required: [
    'ultrawarm', 'natural', 'piglin_safe', 'respawn_anchor_works', 'bed_works',
    'has_raids', 'has_skylight', 'has_ceiling', 'coordinate_scale', 'ambient_light',
    'logical_height', 'effects', 'infiniburn', 'min_y', 'height',
    'monster_spawn_light_level', 'monster_spawn_block_light_limit'
  ],
  definitions: {
    intProvider
  }
};

// Multi-Noise Biome Source Parameter List Schema
export const multiNoiseBiomeSourceParameterListSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    preset: resourceLocation
  },
  required: ['preset']
};

// Tag Schema
export const tagSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    replace: { type: 'boolean' },
    values: {
      type: 'array',
      items: {
        oneOf: [resourceLocation, tagReference]
      }
    }
  },
  required: ['values'],
  additionalProperties: false
};

// pack.mcmeta Schema
export const packMcmetaSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    pack: {
      type: 'object',
      properties: {
        pack_format: { type: 'number' },
        description: descriptionField,
        id: { type: 'string' },
        supported_formats: {
          oneOf: [
            {
              type: 'array',
              items: { type: 'number' }
            },
            {
              type: 'object',
              properties: {
                min_format: { type: 'number' },
                max_format: { type: 'number' }
              },
              required: ['min_format', 'max_format'],
              additionalProperties: false
            }
          ]
        },
        min_format: { type: 'number' },
        max_format: { type: 'number' }
      },
      required: ['pack_format', 'description'],
      additionalProperties: true
    },
    overlays: {
      type: 'object',
      properties: {
        entries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              directory: { type: 'string' },
              formats: {
                type: 'array',
                items: { type: 'number' }
              },
              min_format: { type: 'number' },
              max_format: { type: 'number' }
            },
            required: ['directory'],
            additionalProperties: true
          }
        }
      },
      additionalProperties: true
    }
  },
  required: ['pack'],
  additionalProperties: true
};

// Export all schemas
export const schemas = {
  biome: biomeSchema,
  configured_feature: configuredFeatureSchema,
  placed_feature: placedFeatureSchema,
  configured_carver: configuredCarverSchema,
  structure: structureSchema,
  structure_set: structureSetSchema,
  template_pool: templatePoolSchema,
  processor_list: processorListSchema,
  noise_settings: noiseSettingsSchema,
  density_function: densityFunctionSchema,
  noise: noiseSchema,
  dimension: dimensionSchema,
  world_preset: worldPresetSchema,
  flat_level_generator_preset: flatLevelGeneratorPresetSchema,
  dimension_type: dimensionTypeSchema,
  multi_noise_biome_source_parameter_list: multiNoiseBiomeSourceParameterListSchema,
  tag: tagSchema,
  pack_mcmeta: packMcmetaSchema
};

// Get schema by type
export function getSchema(type) {
  return schemas[type] || null;
}

// Get all schema types
export function getSchemaTypes() {
  return Object.keys(schemas);
}
