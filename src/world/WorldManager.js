import * as THREE from 'three';
import { Chunk } from './Chunk';
import { BlockTypes } from '../blocks/BlockTypes';
import { getMaterialForBlock } from '../rendering/Materials';

export class WorldManager {
  constructor(scene, terrain, chunkSize = 16, renderDistance = 3) {
    this.scene = scene;
    this.terrain = terrain;
    this.chunkSize = chunkSize;
    this.renderDistance = renderDistance;
    this.chunks = new Map();
    this.blockMeshes = new Map();
    this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);
  }

  getChunkKey(chunkX, chunkZ) {
    return `${chunkX},${chunkZ}`;
  }

  getChunkCoords(worldX, worldZ) {
    return {
      x: Math.floor(worldX / this.chunkSize),
      z: Math.floor(worldZ / this.chunkSize)
    };
  }

  getOrCreateChunk(chunkX, chunkZ) {
    const key = this.getChunkKey(chunkX, chunkZ);
    if (!this.chunks.has(key)) {
      const chunk = new Chunk(chunkX, chunkZ, this.chunkSize, this.terrain);
      this.chunks.set(key, chunk);
    }
    return this.chunks.get(key);
  }

  unloadChunk(chunkX, chunkZ) {
    const key = this.getChunkKey(chunkX, chunkZ);
    const chunk = this.chunks.get(key);
    if (chunk) {
      for (const mesh of chunk.meshes || []) {
        this.scene.remove(mesh);
      }
      this.chunks.delete(key);
    }
  }

  update(playerPos) {
    const playerChunk = this.getChunkCoords(playerPos.x, playerPos.z);
    const renderDist = this.renderDistance;

    for (let dx = -renderDist; dx <= renderDist; dx++) {
      for (let dz = -renderDist; dz <= renderDist; dz++) {
        this.getOrCreateChunk(playerChunk.x + dx, playerChunk.z + dz);
      }
    }

    const keysToUnload = [];
    for (const [key, chunk] of this.chunks) {
      const dx = Math.abs(chunk.x - playerChunk.x);
      const dz = Math.abs(chunk.z - playerChunk.z);
      if (dx > renderDist || dz > renderDist) {
        keysToUnload.push(key);
      }
    }

    keysToUnload.forEach((key) => {
      const [x, z] = key.split(',').map(Number);
      this.unloadChunk(x, z);
    });
  }

  getBlockAt(x, y, z) {
    const chunkCoords = this.getChunkCoords(x, z);
    const chunk = this.chunks.get(this.getChunkKey(chunkCoords.x, chunkCoords.z));
    if (!chunk) return BlockTypes.AIR;

    const localX = x - chunkCoords.x * this.chunkSize;
    const localZ = z - chunkCoords.z * this.chunkSize;
    return chunk.getBlock(localX, y, localZ);
  }

  setBlockAt(x, y, z, blockType) {
    const chunkCoords = this.getChunkCoords(x, z);
    const chunk = this.getOrCreateChunk(chunkCoords.x, chunkCoords.z);

    const localX = x - chunkCoords.x * this.chunkSize;
    const localZ = z - chunkCoords.z * this.chunkSize;
    chunk.setBlock(localX, y, localZ, blockType);
  }

  dispose() {
    for (const chunk of this.chunks.values()) {
      for (const mesh of chunk.meshes || []) {
        this.scene.remove(mesh);
      }
    }
    this.chunks.clear();
  }
}
