import { BlockTypes } from '../blocks/BlockTypes';

export class Chunk {
  constructor(x, z, chunkSize, terrain) {
    this.x = x;
    this.z = z;
    this.chunkSize = chunkSize;
    this.terrain = terrain;
    this.blocks = new Map();
    this.heightMap = {};
    this.generated = false;
  }

  keyFor(x, y, z) {
    return `${x},${y},${z}`;
  }

  getBlock(x, y, z) {
    const key = this.keyFor(x, y, z);
    if (this.blocks.has(key)) {
      return this.blocks.get(key);
    }
    
    if (!this.generated) {
      this.generate();
    }
    
    return this.blocks.get(key) || BlockTypes.AIR;
  }

  setBlock(x, y, z, blockType) {
    const key = this.keyFor(x, y, z);
    if (blockType === BlockTypes.AIR) {
      this.blocks.delete(key);
    } else {
      this.blocks.set(key, blockType);
    }
  }

  generate() {
    for (let lx = 0; lx < this.chunkSize; lx++) {
      for (let lz = 0; lz < this.chunkSize; lz++) {
        const worldX = this.x * this.chunkSize + lx;
        const worldZ = this.z * this.chunkSize + lz;
        const height = this.terrain.getHeightAt(worldX, worldZ);
        this.heightMap[`${lx},${lz}`] = height;

        for (let y = 0; y <= height + 1; y++) {
          const block = this.terrain.getBlockAt(worldX, y, worldZ);
          if (block !== BlockTypes.AIR) {
            this.setBlock(lx, y, lz, block);
          }
        }
      }
    }
    this.generated = true;
  }
}
