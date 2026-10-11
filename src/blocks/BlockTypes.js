export const BlockTypes = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  WATER: 5,
  WOOD: 6,
  LEAVES: 7,
  OAK_LOG: 8,
  IRON_ORE: 9,
  GOLD_ORE: 10,
  DIAMOND_ORE: 11,
  CRAFTING_TABLE: 12,
  FURNACE: 13
};

export const BlockNames = {
  0: 'air',
  1: 'grass',
  2: 'dirt',
  3: 'stone',
  4: 'sand',
  5: 'water',
  6: 'wood',
  7: 'leaves',
  8: 'oak_log',
  9: 'iron_ore',
  10: 'gold_ore',
  11: 'diamond_ore',
  12: 'crafting_table',
  13: 'furnace'
};

export const CraftingRecipes = {
  'wooden_pickaxe': {
    ingredients: { 'wood': 3, 'stick': 2 },
    result: { type: 'wooden_pickaxe', amount: 1 }
  },
  'stone_pickaxe': {
    ingredients: { 'stone': 3, 'stick': 2 },
    result: { type: 'stone_pickaxe', amount: 1 }
  },
  'iron_pickaxe': {
    ingredients: { 'iron_ingot': 3, 'stick': 2 },
    result: { type: 'iron_pickaxe', amount: 1 }
  },
  'diamond_pickaxe': {
    ingredients: { 'diamond': 3, 'stick': 2 },
    result: { type: 'diamond_pickaxe', amount: 1 }
  },
  'stick': {
    ingredients: { 'wood': 1 },
    result: { type: 'stick', amount: 4 }
  },
  'workbench': {
    ingredients: { 'wood': 4 },
    result: { type: 'workbench', amount: 1 }
  },
  'furnace': {
    ingredients: { 'stone': 8 },
    result: { type: 'furnace', amount: 1 }
  },
  'car_body': {
    ingredients: { 'iron_ingot': 8, 'wood': 4 },
    result: { type: 'car_body', amount: 1 }
  },
  'car_wheel': {
    ingredients: { 'iron_ingot': 2, 'rubber': 1 },
    result: { type: 'car_wheel', amount: 4 }
  },
  'plane_fuselage': {
    ingredients: { 'aluminum': 10, 'wood': 5 },
    result: { type: 'plane_fuselage', amount: 1 }
  },
  'plane_wing': {
    ingredients: { 'aluminum': 6, 'fabric': 4 },
    result: { type: 'plane_wing', amount: 2 }
  },
  'boat_hull': {
    ingredients: { 'wood': 6 },
    result: { type: 'boat_hull', amount: 1 }
  },
  'go_kart_frame': {
    ingredients: { 'iron_ingot': 4, 'wood': 3 },
    result: { type: 'go_kart_frame', amount: 1 }
  }
};

export const ItemCategories = {
  BLOCKS: 'blocks',
  TOOLS: 'tools',
  MATERIALS: 'materials',
  VEHICLES: 'vehicles',
  MISC: 'misc'
};

export const Items = {
  wood: { name: 'Wood', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  stick: { name: 'Stick', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  stone: { name: 'Stone', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  iron_ore: { name: 'Iron Ore', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  iron_ingot: { name: 'Iron Ingot', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  gold_ore: { name: 'Gold Ore', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  gold_ingot: { name: 'Gold Ingot', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  diamond: { name: 'Diamond', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  aluminum: { name: 'Aluminum', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  rubber: { name: 'Rubber', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  fabric: { name: 'Fabric', category: ItemCategories.MATERIALS, stackable: true, maxStack: 64 },
  wooden_pickaxe: { name: 'Wooden Pickaxe', category: ItemCategories.TOOLS, stackable: false, durability: 100 },
  stone_pickaxe: { name: 'Stone Pickaxe', category: ItemCategories.TOOLS, stackable: false, durability: 250 },
  iron_pickaxe: { name: 'Iron Pickaxe', category: ItemCategories.TOOLS, stackable: false, durability: 500 },
  diamond_pickaxe: { name: 'Diamond Pickaxe', category: ItemCategories.TOOLS, stackable: false, durability: 1500 },
  workbench: { name: 'Workbench', category: ItemCategories.BLOCKS, stackable: true, maxStack: 64 },
  furnace: { name: 'Furnace', category: ItemCategories.BLOCKS, stackable: true, maxStack: 64 },
  car_body: { name: 'Car Body', category: ItemCategories.VEHICLES },
  car_wheel: { name: 'Car Wheel', category: ItemCategories.VEHICLES, stackable: true, maxStack: 4 },
  plane_fuselage: { name: 'Plane Fuselage', category: ItemCategories.VEHICLES },
  plane_wing: { name: 'Plane Wing', category: ItemCategories.VEHICLES, stackable: true, maxStack: 2 },
  boat_hull: { name: 'Boat Hull', category: ItemCategories.VEHICLES },
  go_kart_frame: { name: 'Go-Kart Frame', category: ItemCategories.VEHICLES }
};

export function getBlockType(name) {
  for (const [key, value] of Object.entries(BlockNames)) {
    if (value === name) return parseInt(key);
  }
  return BlockTypes.AIR;
}
