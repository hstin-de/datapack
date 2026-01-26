/**
 * Vanilla Minecraft Registry Data
 * Contains all vanilla registry entries for autocomplete and validation
 */

import { WORLDGEN_REGISTRIES } from './vanilla-worldgen-registry.js';

// Common Minecraft blocks
export const BLOCKS = [
  'minecraft:stone', 'minecraft:granite', 'minecraft:polished_granite', 'minecraft:diorite',
  'minecraft:polished_diorite', 'minecraft:andesite', 'minecraft:polished_andesite',
  'minecraft:deepslate', 'minecraft:cobbled_deepslate', 'minecraft:polished_deepslate',
  'minecraft:calcite', 'minecraft:tuff', 'minecraft:dripstone_block',
  'minecraft:grass_block', 'minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:podzol',
  'minecraft:rooted_dirt', 'minecraft:mud', 'minecraft:crimson_nylium', 'minecraft:warped_nylium',
  'minecraft:cobblestone', 'minecraft:oak_planks', 'minecraft:spruce_planks',
  'minecraft:birch_planks', 'minecraft:jungle_planks', 'minecraft:acacia_planks',
  'minecraft:cherry_planks', 'minecraft:dark_oak_planks', 'minecraft:mangrove_planks',
  'minecraft:bamboo_planks', 'minecraft:crimson_planks', 'minecraft:warped_planks',
  'minecraft:oak_sapling', 'minecraft:spruce_sapling', 'minecraft:birch_sapling',
  'minecraft:jungle_sapling', 'minecraft:acacia_sapling', 'minecraft:cherry_sapling',
  'minecraft:dark_oak_sapling', 'minecraft:mangrove_propagule',
  'minecraft:bedrock', 'minecraft:sand', 'minecraft:red_sand', 'minecraft:gravel',
  'minecraft:coal_ore', 'minecraft:deepslate_coal_ore', 'minecraft:iron_ore',
  'minecraft:deepslate_iron_ore', 'minecraft:copper_ore', 'minecraft:deepslate_copper_ore',
  'minecraft:gold_ore', 'minecraft:deepslate_gold_ore', 'minecraft:redstone_ore',
  'minecraft:deepslate_redstone_ore', 'minecraft:emerald_ore', 'minecraft:deepslate_emerald_ore',
  'minecraft:lapis_ore', 'minecraft:deepslate_lapis_ore', 'minecraft:diamond_ore',
  'minecraft:deepslate_diamond_ore', 'minecraft:nether_gold_ore', 'minecraft:nether_quartz_ore',
  'minecraft:ancient_debris', 'minecraft:raw_iron_block', 'minecraft:raw_copper_block',
  'minecraft:raw_gold_block', 'minecraft:amethyst_block', 'minecraft:budding_amethyst',
  'minecraft:oak_log', 'minecraft:spruce_log', 'minecraft:birch_log', 'minecraft:jungle_log',
  'minecraft:acacia_log', 'minecraft:cherry_log', 'minecraft:dark_oak_log', 'minecraft:mangrove_log',
  'minecraft:crimson_stem', 'minecraft:warped_stem',
  'minecraft:oak_leaves', 'minecraft:spruce_leaves', 'minecraft:birch_leaves',
  'minecraft:jungle_leaves', 'minecraft:acacia_leaves', 'minecraft:cherry_leaves',
  'minecraft:dark_oak_leaves', 'minecraft:mangrove_leaves', 'minecraft:azalea_leaves',
  'minecraft:flowering_azalea_leaves',
  'minecraft:glass', 'minecraft:tinted_glass', 'minecraft:lapis_block', 'minecraft:sandstone',
  'minecraft:chiseled_sandstone', 'minecraft:cut_sandstone', 'minecraft:cobweb',
  'minecraft:short_grass', 'minecraft:fern', 'minecraft:dead_bush', 'minecraft:seagrass',
  'minecraft:tall_seagrass', 'minecraft:sea_pickle', 'minecraft:dandelion', 'minecraft:poppy',
  'minecraft:blue_orchid', 'minecraft:allium', 'minecraft:azure_bluet', 'minecraft:red_tulip',
  'minecraft:orange_tulip', 'minecraft:white_tulip', 'minecraft:pink_tulip', 'minecraft:oxeye_daisy',
  'minecraft:cornflower', 'minecraft:lily_of_the_valley', 'minecraft:wither_rose',
  'minecraft:torchflower', 'minecraft:pitcher_plant', 'minecraft:spore_blossom',
  'minecraft:brown_mushroom', 'minecraft:red_mushroom', 'minecraft:crimson_fungus',
  'minecraft:warped_fungus', 'minecraft:crimson_roots', 'minecraft:warped_roots',
  'minecraft:nether_sprouts', 'minecraft:weeping_vines', 'minecraft:twisting_vines',
  'minecraft:sugar_cane', 'minecraft:kelp', 'minecraft:moss_carpet', 'minecraft:pink_petals',
  'minecraft:moss_block', 'minecraft:hanging_roots', 'minecraft:big_dripleaf',
  'minecraft:small_dripleaf', 'minecraft:bamboo', 'minecraft:gold_block', 'minecraft:iron_block',
  'minecraft:oak_slab', 'minecraft:spruce_slab', 'minecraft:birch_slab', 'minecraft:jungle_slab',
  'minecraft:acacia_slab', 'minecraft:cherry_slab', 'minecraft:dark_oak_slab',
  'minecraft:bricks', 'minecraft:tnt', 'minecraft:bookshelf', 'minecraft:chiseled_bookshelf',
  'minecraft:mossy_cobblestone', 'minecraft:obsidian', 'minecraft:crying_obsidian',
  'minecraft:torch', 'minecraft:soul_torch', 'minecraft:end_rod',
  'minecraft:spawner', 'minecraft:chest', 'minecraft:crafting_table', 'minecraft:furnace',
  'minecraft:ice', 'minecraft:packed_ice', 'minecraft:blue_ice', 'minecraft:snow',
  'minecraft:snow_block', 'minecraft:cactus', 'minecraft:clay', 'minecraft:jukebox',
  'minecraft:pumpkin', 'minecraft:carved_pumpkin', 'minecraft:jack_o_lantern',
  'minecraft:netherrack', 'minecraft:soul_sand', 'minecraft:soul_soil', 'minecraft:basalt',
  'minecraft:polished_basalt', 'minecraft:smooth_basalt', 'minecraft:glowstone',
  'minecraft:stone_bricks', 'minecraft:mossy_stone_bricks', 'minecraft:cracked_stone_bricks',
  'minecraft:chiseled_stone_bricks', 'minecraft:infested_stone', 'minecraft:brown_mushroom_block',
  'minecraft:red_mushroom_block', 'minecraft:mushroom_stem', 'minecraft:melon',
  'minecraft:mycelium', 'minecraft:nether_bricks', 'minecraft:cracked_nether_bricks',
  'minecraft:chiseled_nether_bricks', 'minecraft:end_stone', 'minecraft:end_stone_bricks',
  'minecraft:dragon_egg', 'minecraft:emerald_block', 'minecraft:command_block',
  'minecraft:beacon', 'minecraft:quartz_block', 'minecraft:chiseled_quartz_block',
  'minecraft:quartz_pillar', 'minecraft:prismarine', 'minecraft:prismarine_bricks',
  'minecraft:dark_prismarine', 'minecraft:sea_lantern', 'minecraft:hay_block',
  'minecraft:terracotta', 'minecraft:coal_block', 'minecraft:slime_block',
  'minecraft:honey_block', 'minecraft:purpur_block', 'minecraft:purpur_pillar',
  'minecraft:end_stone_bricks', 'minecraft:magma_block', 'minecraft:nether_wart_block',
  'minecraft:warped_wart_block', 'minecraft:red_nether_bricks', 'minecraft:bone_block',
  'minecraft:shulker_box', 'minecraft:white_glazed_terracotta', 'minecraft:concrete',
  'minecraft:white_concrete', 'minecraft:black_concrete',
  'minecraft:water', 'minecraft:lava', 'minecraft:air', 'minecraft:cave_air', 'minecraft:void_air',
  'minecraft:barrier', 'minecraft:light', 'minecraft:structure_void', 'minecraft:structure_block',
  'minecraft:sculk', 'minecraft:sculk_vein', 'minecraft:sculk_catalyst', 'minecraft:sculk_shrieker',
  'minecraft:sculk_sensor', 'minecraft:calibrated_sculk_sensor',
  'minecraft:reinforced_deepslate', 'minecraft:decorated_pot',
  'minecraft:suspicious_sand', 'minecraft:suspicious_gravel',
  'minecraft:pale_oak_log', 'minecraft:pale_oak_leaves', 'minecraft:pale_moss_block',
  'minecraft:pale_hanging_moss', 'minecraft:pale_oak_planks', 'minecraft:pale_oak_sapling'
];

// Vanilla biomes
export const BIOMES = [
  'minecraft:the_void', 'minecraft:plains', 'minecraft:sunflower_plains',
  'minecraft:snowy_plains', 'minecraft:ice_spikes', 'minecraft:desert',
  'minecraft:swamp', 'minecraft:mangrove_swamp', 'minecraft:forest',
  'minecraft:flower_forest', 'minecraft:birch_forest', 'minecraft:dark_forest',
  'minecraft:old_growth_birch_forest', 'minecraft:old_growth_pine_taiga',
  'minecraft:old_growth_spruce_taiga', 'minecraft:taiga', 'minecraft:snowy_taiga',
  'minecraft:savanna', 'minecraft:savanna_plateau', 'minecraft:windswept_hills',
  'minecraft:windswept_gravelly_hills', 'minecraft:windswept_forest',
  'minecraft:windswept_savanna', 'minecraft:jungle', 'minecraft:sparse_jungle',
  'minecraft:bamboo_jungle', 'minecraft:badlands', 'minecraft:eroded_badlands',
  'minecraft:wooded_badlands', 'minecraft:meadow', 'minecraft:cherry_grove',
  'minecraft:grove', 'minecraft:snowy_slopes', 'minecraft:frozen_peaks',
  'minecraft:jagged_peaks', 'minecraft:stony_peaks', 'minecraft:river',
  'minecraft:frozen_river', 'minecraft:beach', 'minecraft:snowy_beach',
  'minecraft:stony_shore', 'minecraft:warm_ocean', 'minecraft:lukewarm_ocean',
  'minecraft:deep_lukewarm_ocean', 'minecraft:ocean', 'minecraft:deep_ocean',
  'minecraft:cold_ocean', 'minecraft:deep_cold_ocean', 'minecraft:frozen_ocean',
  'minecraft:deep_frozen_ocean', 'minecraft:mushroom_fields',
  'minecraft:dripstone_caves', 'minecraft:lush_caves', 'minecraft:deep_dark',
  'minecraft:nether_wastes', 'minecraft:warped_forest', 'minecraft:crimson_forest',
  'minecraft:soul_sand_valley', 'minecraft:basalt_deltas',
  'minecraft:the_end', 'minecraft:end_highlands', 'minecraft:end_midlands',
  'minecraft:small_end_islands', 'minecraft:end_barrens',
  'minecraft:pale_garden'
];

// Entity types for spawners
export const ENTITIES = [
  'minecraft:allay', 'minecraft:armadillo', 'minecraft:axolotl', 'minecraft:bat',
  'minecraft:bee', 'minecraft:blaze', 'minecraft:bogged', 'minecraft:breeze',
  'minecraft:camel', 'minecraft:cat', 'minecraft:cave_spider', 'minecraft:chicken',
  'minecraft:cod', 'minecraft:cow', 'minecraft:creaking', 'minecraft:creeper',
  'minecraft:dolphin', 'minecraft:donkey', 'minecraft:drowned', 'minecraft:elder_guardian',
  'minecraft:ender_dragon', 'minecraft:enderman', 'minecraft:endermite', 'minecraft:evoker',
  'minecraft:fox', 'minecraft:frog', 'minecraft:ghast', 'minecraft:glow_squid',
  'minecraft:goat', 'minecraft:guardian', 'minecraft:hoglin', 'minecraft:horse',
  'minecraft:husk', 'minecraft:illusioner', 'minecraft:iron_golem', 'minecraft:llama',
  'minecraft:magma_cube', 'minecraft:mooshroom', 'minecraft:mule', 'minecraft:ocelot',
  'minecraft:panda', 'minecraft:parrot', 'minecraft:phantom', 'minecraft:pig',
  'minecraft:piglin', 'minecraft:piglin_brute', 'minecraft:pillager', 'minecraft:polar_bear',
  'minecraft:pufferfish', 'minecraft:rabbit', 'minecraft:ravager', 'minecraft:salmon',
  'minecraft:sheep', 'minecraft:shulker', 'minecraft:silverfish', 'minecraft:skeleton',
  'minecraft:skeleton_horse', 'minecraft:slime', 'minecraft:sniffer', 'minecraft:snow_golem',
  'minecraft:spider', 'minecraft:squid', 'minecraft:stray', 'minecraft:strider',
  'minecraft:tadpole', 'minecraft:trader_llama', 'minecraft:tropical_fish', 'minecraft:turtle',
  'minecraft:vex', 'minecraft:villager', 'minecraft:vindicator', 'minecraft:wandering_trader',
  'minecraft:warden', 'minecraft:witch', 'minecraft:wither', 'minecraft:wither_skeleton',
  'minecraft:wolf', 'minecraft:zoglin', 'minecraft:zombie', 'minecraft:zombie_horse',
  'minecraft:zombie_villager', 'minecraft:zombified_piglin'
];

// Structure types
export const STRUCTURES = [
  'minecraft:pillager_outpost', 'minecraft:mineshaft', 'minecraft:mineshaft_mesa',
  'minecraft:mansion', 'minecraft:jungle_pyramid', 'minecraft:desert_pyramid',
  'minecraft:igloo', 'minecraft:shipwreck', 'minecraft:shipwreck_beached',
  'minecraft:swamp_hut', 'minecraft:stronghold', 'minecraft:monument',
  'minecraft:ocean_ruin_cold', 'minecraft:ocean_ruin_warm', 'minecraft:fortress',
  'minecraft:nether_fossil', 'minecraft:end_city', 'minecraft:buried_treasure',
  'minecraft:bastion_remnant', 'minecraft:village_plains', 'minecraft:village_desert',
  'minecraft:village_savanna', 'minecraft:village_snowy', 'minecraft:village_taiga',
  'minecraft:ruined_portal', 'minecraft:ruined_portal_desert', 'minecraft:ruined_portal_jungle',
  'minecraft:ruined_portal_swamp', 'minecraft:ruined_portal_mountain',
  'minecraft:ruined_portal_ocean', 'minecraft:ruined_portal_nether',
  'minecraft:ancient_city', 'minecraft:trail_ruins', 'minecraft:trial_chambers'
];

// Configured feature types
export const FEATURE_TYPES = [
  'minecraft:tree', 'minecraft:flower', 'minecraft:no_bonemeal_flower',
  'minecraft:random_patch', 'minecraft:block_pile', 'minecraft:spring_feature',
  'minecraft:ore', 'minecraft:replace_single_block', 'minecraft:void_start_platform',
  'minecraft:desert_well', 'minecraft:fossil', 'minecraft:huge_red_mushroom',
  'minecraft:huge_brown_mushroom', 'minecraft:ice_spike', 'minecraft:glowstone_blob',
  'minecraft:freeze_top_layer', 'minecraft:vines', 'minecraft:block_column',
  'minecraft:vegetation_patch', 'minecraft:waterlogged_vegetation_patch',
  'minecraft:root_system', 'minecraft:multiface_growth', 'minecraft:underwater_magma',
  'minecraft:monster_room', 'minecraft:blue_ice', 'minecraft:iceberg',
  'minecraft:forest_rock', 'minecraft:disk', 'minecraft:lake',
  'minecraft:dripstone_cluster', 'minecraft:large_dripstone', 'minecraft:pointed_dripstone',
  'minecraft:sculk_patch', 'minecraft:geode', 'minecraft:kelp', 'minecraft:coral_tree',
  'minecraft:coral_mushroom', 'minecraft:coral_claw', 'minecraft:sea_pickle',
  'minecraft:simple_block', 'minecraft:bamboo', 'minecraft:random_boolean_selector',
  'minecraft:random_selector', 'minecraft:simple_random_selector', 'minecraft:fill_layer',
  'minecraft:bonus_chest', 'minecraft:end_spike', 'minecraft:end_island',
  'minecraft:chorus_plant', 'minecraft:end_gateway', 'minecraft:seagrass',
  'minecraft:no_op', 'minecraft:twisting_vines', 'minecraft:weeping_vines',
  'minecraft:basalt_columns', 'minecraft:basalt_pillar', 'minecraft:delta_feature',
  'minecraft:nether_forest_vegetation', 'minecraft:crimson_forest_vegetation',
  'minecraft:warped_forest_vegetation', 'minecraft:huge_fungus', 'minecraft:scattered_ore',
  'minecraft:fallen_tree'
];

// Placement modifier types
export const PLACEMENT_TYPES = [
  'minecraft:biome', 'minecraft:block_predicate_filter', 'minecraft:carving_mask',
  'minecraft:count', 'minecraft:count_on_every_layer', 'minecraft:environment_scan',
  'minecraft:fixed_placement', 'minecraft:height_range', 'minecraft:heightmap',
  'minecraft:in_square', 'minecraft:noise_based_count', 'minecraft:noise_threshold_count',
  'minecraft:random_offset', 'minecraft:rarity_filter', 'minecraft:surface_relative_threshold_filter',
  'minecraft:surface_water_depth_filter'
];

// Carver types
export const CARVER_TYPES = [
  'minecraft:cave', 'minecraft:nether_cave', 'minecraft:canyon'
];

// Trunk placer types
export const TRUNK_PLACER_TYPES = [
  'minecraft:straight_trunk_placer', 'minecraft:forking_trunk_placer',
  'minecraft:giant_trunk_placer', 'minecraft:mega_jungle_trunk_placer',
  'minecraft:dark_oak_trunk_placer', 'minecraft:fancy_trunk_placer',
  'minecraft:bending_trunk_placer', 'minecraft:upwards_branching_trunk_placer',
  'minecraft:cherry_trunk_placer'
];

// Foliage placer types
export const FOLIAGE_PLACER_TYPES = [
  'minecraft:blob_foliage_placer', 'minecraft:spruce_foliage_placer',
  'minecraft:pine_foliage_placer', 'minecraft:acacia_foliage_placer',
  'minecraft:bush_foliage_placer', 'minecraft:fancy_foliage_placer',
  'minecraft:jungle_foliage_placer', 'minecraft:mega_pine_foliage_placer',
  'minecraft:dark_oak_foliage_placer', 'minecraft:random_spread_foliage_placer',
  'minecraft:cherry_foliage_placer'
];

// State provider types
export const STATE_PROVIDER_TYPES = [
  'minecraft:simple_state_provider', 'minecraft:rotated_block_provider',
  'minecraft:weighted_state_provider', 'minecraft:randomized_int_state_provider',
  'minecraft:noise_provider', 'minecraft:noise_threshold_provider',
  'minecraft:dual_noise_provider'
];

// Block predicate types
export const BLOCK_PREDICATE_TYPES = [
  'minecraft:always_true', 'minecraft:all_of', 'minecraft:any_of', 'minecraft:not',
  'minecraft:matching_blocks', 'minecraft:matching_block_tag', 'minecraft:matching_fluids',
  'minecraft:matching_fluid_tag', 'minecraft:has_sturdy_face', 'minecraft:solid',
  'minecraft:replaceable', 'minecraft:would_survive', 'minecraft:inside_world_bounds',
  'minecraft:unobstructed'
];

// Height provider types
export const HEIGHT_PROVIDER_TYPES = [
  'minecraft:constant', 'minecraft:uniform', 'minecraft:biased_to_bottom',
  'minecraft:very_biased_to_bottom', 'minecraft:trapezoid', 'minecraft:weighted_list'
];

// Int provider types
export const INT_PROVIDER_TYPES = [
  'minecraft:constant', 'minecraft:uniform', 'minecraft:biased_to_bottom',
  'minecraft:clamped', 'minecraft:clamped_normal', 'minecraft:weighted_list'
];

// Float provider types
export const FLOAT_PROVIDER_TYPES = [
  'minecraft:constant', 'minecraft:uniform', 'minecraft:clamped_normal', 'minecraft:trapezoid'
];

// Density function types
export const DENSITY_FUNCTION_TYPES = [
  'minecraft:abs', 'minecraft:add', 'minecraft:beardifier', 'minecraft:blend_alpha',
  'minecraft:blend_density', 'minecraft:blend_offset', 'minecraft:cache_2d',
  'minecraft:cache_all_in_cell', 'minecraft:cache_once', 'minecraft:clamp',
  'minecraft:constant', 'minecraft:cube', 'minecraft:end_islands', 'minecraft:flat_cache',
  'minecraft:half_negative', 'minecraft:interpolated', 'minecraft:max', 'minecraft:min',
  'minecraft:mul', 'minecraft:noise', 'minecraft:old_blended_noise', 'minecraft:quarter_negative',
  'minecraft:range_choice', 'minecraft:shift', 'minecraft:shift_a', 'minecraft:shift_b',
  'minecraft:shifted_noise', 'minecraft:slide', 'minecraft:spline', 'minecraft:square',
  'minecraft:squeeze', 'minecraft:weird_scaled_sampler', 'minecraft:y_clamped_gradient'
];

// Processor types
export const PROCESSOR_TYPES = [
  'minecraft:block_age', 'minecraft:block_ignore', 'minecraft:block_rot',
  'minecraft:capped', 'minecraft:gravity', 'minecraft:jigsaw_replacement',
  'minecraft:lava_submerged_block', 'minecraft:nop', 'minecraft:protected_blocks',
  'minecraft:rule'
];

// Rule test types (for processor rules)
export const RULE_TEST_TYPES = [
  'minecraft:always_true', 'minecraft:block_match', 'minecraft:blockstate_match',
  'minecraft:tag_match', 'minecraft:random_block_match', 'minecraft:random_blockstate_match'
];

// Position test types
export const POS_RULE_TEST_TYPES = [
  'minecraft:always_true', 'minecraft:axis_aligned_linear_pos', 'minecraft:linear_pos'
];

// Structure placement types
export const STRUCTURE_PLACEMENT_TYPES = [
  'minecraft:random_spread', 'minecraft:concentric_rings'
];

// Terrain adaptation types
export const TERRAIN_ADAPTATION_TYPES = [
  'none', 'bury', 'beard_thin', 'beard_box', 'encapsulate'
];

// Heightmap types
export const HEIGHTMAP_TYPES = [
  'WORLD_SURFACE_WG', 'WORLD_SURFACE', 'OCEAN_FLOOR_WG', 'OCEAN_FLOOR',
  'MOTION_BLOCKING', 'MOTION_BLOCKING_NO_LEAVES'
];

// Pool element types
export const POOL_ELEMENT_TYPES = [
  'minecraft:empty_pool_element', 'minecraft:feature_pool_element',
  'minecraft:legacy_single_pool_element', 'minecraft:list_pool_element',
  'minecraft:single_pool_element'
];

// Projection types
export const PROJECTION_TYPES = [
  'rigid', 'terrain_matching'
];

// Decoration steps (for biome features)
export const DECORATION_STEPS = [
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

// Mob categories for spawning
export const MOB_CATEGORIES = [
  'monster', 'creature', 'ambient', 'axolotls', 'underground_water_creature',
  'water_creature', 'water_ambient', 'misc'
];

// Sound events (common ones)
export const SOUND_EVENTS = [
  'minecraft:ambient.cave', 'minecraft:ambient.basalt_deltas.loop',
  'minecraft:ambient.basalt_deltas.additions', 'minecraft:ambient.basalt_deltas.mood',
  'minecraft:ambient.crimson_forest.loop', 'minecraft:ambient.crimson_forest.additions',
  'minecraft:ambient.crimson_forest.mood', 'minecraft:ambient.nether_wastes.loop',
  'minecraft:ambient.nether_wastes.additions', 'minecraft:ambient.nether_wastes.mood',
  'minecraft:ambient.soul_sand_valley.loop', 'minecraft:ambient.soul_sand_valley.additions',
  'minecraft:ambient.soul_sand_valley.mood', 'minecraft:ambient.warped_forest.loop',
  'minecraft:ambient.warped_forest.additions', 'minecraft:ambient.warped_forest.mood',
  'minecraft:ambient.underwater.loop', 'minecraft:ambient.underwater.loop.additions',
  'minecraft:ambient.underwater.loop.additions.rare', 'minecraft:ambient.underwater.loop.additions.ultra_rare'
];

// Music tracks
export const MUSIC = [
  'minecraft:music.overworld.forest', 'minecraft:music.overworld.swamp',
  'minecraft:music.overworld.jungle', 'minecraft:music.overworld.desert',
  'minecraft:music.overworld.badlands', 'minecraft:music.overworld.old_growth_taiga',
  'minecraft:music.overworld.meadow', 'minecraft:music.overworld.cherry_grove',
  'minecraft:music.overworld.snowy_slopes', 'minecraft:music.overworld.frozen_peaks',
  'minecraft:music.overworld.jagged_peaks', 'minecraft:music.overworld.stony_peaks',
  'minecraft:music.overworld.grove', 'minecraft:music.overworld.deep_dark',
  'minecraft:music.overworld.lush_caves', 'minecraft:music.overworld.dripstone_caves',
  'minecraft:music.nether.nether_wastes', 'minecraft:music.nether.soul_sand_valley',
  'minecraft:music.nether.crimson_forest', 'minecraft:music.nether.warped_forest',
  'minecraft:music.nether.basalt_deltas', 'minecraft:music.end',
  'minecraft:music.game', 'minecraft:music.creative', 'minecraft:music.menu',
  'minecraft:music.credits', 'minecraft:music.dragon', 'minecraft:music.under_water'
];

// Particle types (for biome effects)
export const PARTICLES = [
  'minecraft:ash', 'minecraft:crimson_spore', 'minecraft:warped_spore',
  'minecraft:white_ash', 'minecraft:spore_blossom_air', 'minecraft:mycelium',
  'minecraft:cherry_leaves', 'minecraft:pale_oak_leaves'
];

// Block tags (common ones)
export const BLOCK_TAGS = [
  '#minecraft:stone_ore_replaceables', '#minecraft:deepslate_ore_replaceables',
  '#minecraft:base_stone_overworld', '#minecraft:base_stone_nether',
  '#minecraft:dirt', '#minecraft:sand', '#minecraft:logs', '#minecraft:leaves',
  '#minecraft:flowers', '#minecraft:small_flowers', '#minecraft:tall_flowers',
  '#minecraft:saplings', '#minecraft:replaceable_plants', '#minecraft:replaceable',
  '#minecraft:lush_ground_replaceable', '#minecraft:moss_replaceable',
  '#minecraft:sculk_replaceable', '#minecraft:sculk_replaceable_world_gen',
  '#minecraft:features_cannot_replace', '#minecraft:geode_invalid_blocks',
  '#minecraft:dripstone_replaceable_blocks', '#minecraft:azalea_grows_on',
  '#minecraft:overworld_carver_replaceables', '#minecraft:nether_carver_replaceables',
  '#minecraft:cave_vines', '#minecraft:mangrove_logs_can_grow_through',
  '#minecraft:mangrove_roots_can_grow_through', '#minecraft:coral_blocks',
  '#minecraft:wall_corals', '#minecraft:infiniburn_overworld',
  '#minecraft:infiniburn_nether', '#minecraft:infiniburn_end'
];

// Biome tags
export const BIOME_TAGS = [
  '#minecraft:is_overworld', '#minecraft:is_nether', '#minecraft:is_end',
  '#minecraft:is_ocean', '#minecraft:is_deep_ocean', '#minecraft:is_beach',
  '#minecraft:is_river', '#minecraft:is_mountain', '#minecraft:is_hill',
  '#minecraft:is_taiga', '#minecraft:is_jungle', '#minecraft:is_forest',
  '#minecraft:is_savanna', '#minecraft:is_badlands', '#minecraft:has_structure/mineshaft',
  '#minecraft:has_structure/stronghold', '#minecraft:has_structure/village_plains',
  '#minecraft:has_structure/village_desert', '#minecraft:has_structure/village_savanna',
  '#minecraft:has_structure/village_snowy', '#minecraft:has_structure/village_taiga',
  '#minecraft:has_structure/ruined_portal_standard', '#minecraft:has_structure/ruined_portal_desert',
  '#minecraft:has_structure/ruined_portal_jungle', '#minecraft:has_structure/ruined_portal_swamp',
  '#minecraft:has_structure/ruined_portal_mountain', '#minecraft:has_structure/ruined_portal_ocean',
  '#minecraft:has_structure/ruined_portal_nether', '#minecraft:spawns_cold_variant_frogs',
  '#minecraft:spawns_warm_variant_frogs', '#minecraft:without_zombie_sieges',
  '#minecraft:without_patrol_spawns', '#minecraft:without_wandering_trader_spawns'
];

// Noises
export const NOISES = [
  'minecraft:temperature', 'minecraft:vegetation', 'minecraft:continentalness',
  'minecraft:erosion', 'minecraft:ridge', 'minecraft:offset', 'minecraft:aquifer_barrier',
  'minecraft:aquifer_fluid_level_floodedness', 'minecraft:aquifer_fluid_level_spread',
  'minecraft:aquifer_lava', 'minecraft:cave_entrance', 'minecraft:cave_layer',
  'minecraft:cave_cheese', 'minecraft:ore_vein_a', 'minecraft:ore_vein_b',
  'minecraft:ore_veininess', 'minecraft:ore_gap', 'minecraft:noodle',
  'minecraft:noodle_ridge_a', 'minecraft:noodle_ridge_b', 'minecraft:noodle_thickness',
  'minecraft:pillar', 'minecraft:pillar_rareness', 'minecraft:pillar_thickness',
  'minecraft:spaghetti_2d', 'minecraft:spaghetti_2d_elevation', 'minecraft:spaghetti_2d_modulator',
  'minecraft:spaghetti_2d_thickness', 'minecraft:spaghetti_3d_1', 'minecraft:spaghetti_3d_2',
  'minecraft:spaghetti_3d_rarity', 'minecraft:spaghetti_3d_thickness', 'minecraft:spaghetti_roughness',
  'minecraft:spaghetti_roughness_modulator', 'minecraft:surface', 'minecraft:surface_secondary',
  'minecraft:packed_ice', 'minecraft:ice', 'minecraft:soul_sand_layer', 'minecraft:gravel_layer',
  'minecraft:netherrack', 'minecraft:nether_wart', 'minecraft:nether_state_selector',
  'minecraft:calcite', 'minecraft:gravel', 'minecraft:clay_bands_offset',
  'minecraft:badlands_pillar', 'minecraft:badlands_pillar_roof', 'minecraft:badlands_surface',
  'minecraft:iceberg_pillar', 'minecraft:iceberg_pillar_roof', 'minecraft:iceberg_surface',
  'minecraft:powder_snow', 'minecraft:patch', 'minecraft:jagged'
];

// Dimension types
export const DIMENSION_TYPES = [
  'minecraft:overworld', 'minecraft:overworld_caves', 'minecraft:the_nether', 'minecraft:the_end'
];

// Generator types
export const GENERATOR_TYPES = [
  'minecraft:noise', 'minecraft:flat', 'minecraft:debug'
];

// Biome source types
export const BIOME_SOURCE_TYPES = [
  'minecraft:multi_noise', 'minecraft:fixed', 'minecraft:checkerboard', 'minecraft:the_end'
];

// Noise settings presets
export const NOISE_SETTINGS = [
  'minecraft:overworld', 'minecraft:large_biomes', 'minecraft:amplified',
  'minecraft:nether', 'minecraft:end', 'minecraft:caves', 'minecraft:floating_islands'
];

// Multi-noise biome source presets
export const MULTI_NOISE_PRESETS = [
  'minecraft:overworld', 'minecraft:nether'
];

// Configured carvers (vanilla)
export const CONFIGURED_CARVERS = [
  'minecraft:cave', 'minecraft:cave_extra_underground', 'minecraft:canyon',
  'minecraft:nether_cave'
];

// Export all registries as a map for easy lookup
export const REGISTRIES = {
  block: BLOCKS,
  biome: BIOMES,
  entity_type: ENTITIES,
  structure: STRUCTURES,
  feature_type: FEATURE_TYPES,
  placement_type: PLACEMENT_TYPES,
  carver_type: CARVER_TYPES,
  trunk_placer_type: TRUNK_PLACER_TYPES,
  foliage_placer_type: FOLIAGE_PLACER_TYPES,
  state_provider_type: STATE_PROVIDER_TYPES,
  block_predicate_type: BLOCK_PREDICATE_TYPES,
  height_provider_type: HEIGHT_PROVIDER_TYPES,
  int_provider_type: INT_PROVIDER_TYPES,
  float_provider_type: FLOAT_PROVIDER_TYPES,
  density_function_type: DENSITY_FUNCTION_TYPES,
  processor_type: PROCESSOR_TYPES,
  rule_test_type: RULE_TEST_TYPES,
  pos_rule_test_type: POS_RULE_TEST_TYPES,
  structure_placement_type: STRUCTURE_PLACEMENT_TYPES,
  terrain_adaptation_type: TERRAIN_ADAPTATION_TYPES,
  heightmap_type: HEIGHTMAP_TYPES,
  pool_element_type: POOL_ELEMENT_TYPES,
  projection_type: PROJECTION_TYPES,
  decoration_step: DECORATION_STEPS,
  mob_category: MOB_CATEGORIES,
  sound_event: SOUND_EVENTS,
  music: MUSIC,
  particle: PARTICLES,
  block_tag: BLOCK_TAGS,
  biome_tag: BIOME_TAGS,
  noise: NOISES,
  dimension_type: DIMENSION_TYPES,
  generator_type: GENERATOR_TYPES,
  biome_source_type: BIOME_SOURCE_TYPES,
  noise_settings: NOISE_SETTINGS,
  multi_noise_preset: MULTI_NOISE_PRESETS,
  configured_carver: CONFIGURED_CARVERS,
  ...WORLDGEN_REGISTRIES
};

// Helper to check if a value is a valid registry entry
export function isValidRegistryEntry(registry, value) {
  const entries = REGISTRIES[registry];
  if (!entries) return true; // Unknown registry, allow anything
  return entries.includes(value);
}

// Helper to get suggestions for a registry
export function getRegistrySuggestions(registry, filter = '') {
  const entries = REGISTRIES[registry] || [];
  const lower = filter.toLowerCase();
  return entries.filter(e => e.toLowerCase().includes(lower));
}

// Helper to validate resource location format
export function isValidResourceLocation(value) {
  if (!value || typeof value !== 'string') return false;
  // Format: namespace:path or #namespace:path for tags
  const pattern = /^#?[a-z0-9_.-]+:[a-z0-9_./=-]+$/;
  return pattern.test(value);
}

// Helper to parse resource location
export function parseResourceLocation(value) {
  if (!value) return null;
  const isTag = value.startsWith('#');
  const clean = isTag ? value.slice(1) : value;
  const colonIndex = clean.indexOf(':');
  if (colonIndex === -1) {
    return { namespace: 'minecraft', path: clean, isTag };
  }
  return {
    namespace: clean.slice(0, colonIndex),
    path: clean.slice(colonIndex + 1),
    isTag
  };
}

// Helper to create resource location
export function createResourceLocation(namespace, path, isTag = false) {
  const prefix = isTag ? '#' : '';
  return `${prefix}${namespace}:${path}`;
}
