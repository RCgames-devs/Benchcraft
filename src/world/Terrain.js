import { SimplexNoise } from '../utils/Noise';
import { BlockTypes } from '../blocks/BlockTypes';

export class Terrain {
  constructor(seed = 0) {
    this.noise = new SimplexNoise(seed);
    this.seed = seed;
  }

  getHeightAt(x, z) {
    const scale = 30;
    const mountainScale = 25;
    const baseHeight = 5;
    
    const height = this.noise.octavePerlin2D(
      x,
      z,
      4,
      0.5,
      scale
    );

    const mountains = this.noise.octavePerlin2D(
      x * 0.5,
      z * 0.5,
      3,
      0.6,
      mountainScale
    );

    const combined = height * 0.7 + mountains * 0.3;
    return Math.max(1, Math.floor(baseHeight + combined * 6));
  }

  getBlockAt(x, y, z) {
    const surfaceHeight = this.getHeightAt(x, z);

    if (y > surfaceHeight) {
      return BlockTypes.AIR;
    }

    if (y === surfaceHeight) {
      return BlockTypes.GRASS;
    }

    if (y > surfaceHeight - 4) {
      return BlockTypes.DIRT;
    }

    if (y > 0) {
      return BlockTypes.STONE;
    }

    return BlockTypes.AIR;
  }
}
