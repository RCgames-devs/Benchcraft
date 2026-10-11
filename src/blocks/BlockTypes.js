export const BlockTypes = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2,
  STONE: 3,
  SAND: 4,
  WATER: 5,
  WOOD: 6,
  LEAVES: 7
};

export const BlockNames = {
  0: 'air',
  1: 'grass',
  2: 'dirt',
  3: 'stone',
  4: 'sand',
  5: 'water',
  6: 'wood',
  7: 'leaves'
};

export function getBlockType(name) {
  for (const [key, value] of Object.entries(BlockNames)) {
    if (value === name) return parseInt(key);
  }
  return BlockTypes.AIR;
}
