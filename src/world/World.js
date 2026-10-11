import { Chunk } from './Chunk';
import { Terrain } from './Terrain';
import * as THREE from 'three';

export class World {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.chunkSize = options.chunkSize || 32;
        this.renderDistance = options.renderDistance || 10;
        this.seed = options.seed || 0;
        
        this.loadedChunks = new Map();
        this.terrain = new Terrain(this.seed);
        this.chunkQueue = [];
    }

    /**
     * Get chunk key for coordinates
     */
    getChunkKey(x, y, z) {
        return `${Math.floor(x / this.chunkSize)}_${Math.floor(y / this.chunkSize)}_${Math.floor(z / this.chunkSize)}`;
    }

    /**
     * Get chunk world position from chunk coordinates
     */
    getChunkWorldPos(chunkX, chunkY, chunkZ) {
        return {
            x: chunkX * this.chunkSize,
            y: chunkY * this.chunkSize,
            z: chunkZ * this.chunkSize
        };
    }

    /**
     * Get chunk coordinates from world position
     */
    getChunkCoords(x, y, z) {
        return {
            x: Math.floor(x / this.chunkSize),
            y: Math.floor(y / this.chunkSize),
            z: Math.floor(z / this.chunkSize)
        };
    }

    /**
     * Load or get a chunk
     */
    getOrCreateChunk(chunkX, chunkY, chunkZ) {
        const key = `${chunkX}_${chunkY}_${chunkZ}`;
        
        if (this.loadedChunks.has(key)) {
            return this.loadedChunks.get(key);
        }

        // Create new chunk
        const worldPos = this.getChunkWorldPos(chunkX, chunkY, chunkZ);
        const chunk = new Chunk(chunkX, chunkY, chunkZ, this.chunkSize, this.terrain);
        
        this.loadedChunks.set(key, chunk);
        this.scene.add(chunk.mesh);

        return chunk;
    }

    /**
     * Unload a chunk
     */
    unloadChunk(chunkX, chunkY, chunkZ) {
        const key = `${chunkX}_${chunkY}_${chunkZ}`;
        
        if (this.loadedChunks.has(key)) {
            const chunk = this.loadedChunks.get(key);
            this.scene.remove(chunk.mesh);
            chunk.dispose();
            this.loadedChunks.delete(key);
        }
    }

    /**
     * Update loaded chunks based on player position
     */
    update(playerPos) {
        const playerChunkCoords = this.getChunkCoords(playerPos.x, playerPos.y, playerPos.z);
        const renderDist = this.renderDistance;

        // Load chunks around player
        for (let dx = -renderDist; dx <= renderDist; dx++) {
            for (let dy = -renderDist; dy <= renderDist; dy++) {
                for (let dz = -renderDist; dz <= renderDist; dz++) {
                    const chunkX = playerChunkCoords.x + dx;
                    const chunkY = playerChunkCoords.y + dy;
                    const chunkZ = playerChunkCoords.z + dz;
                    
                    this.getOrCreateChunk(chunkX, chunkY, chunkZ);
                }
            }
        }

        // Unload distant chunks
        const keysToUnload = [];
        for (const [key, chunk] of this.loadedChunks) {
            const dx = Math.abs(chunk.x - playerChunkCoords.x);
            const dy = Math.abs(chunk.y - playerChunkCoords.y);
            const dz = Math.abs(chunk.z - playerChunkCoords.z);
            
            if (dx > renderDist || dy > renderDist || dz > renderDist) {
                keysToUnload.push(key);
            }
        }

        keysToUnload.forEach(key => {
            const parts = key.split('_').map(Number);
            this.unloadChunk(parts[0], parts[1], parts[2]);
        });
    }

    /**
     * Set block at world position
     */
    setBlock(x, y, z, blockType) {
        const chunkCoords = this.getChunkCoords(x, y, z);
        const chunk = this.getOrCreateChunk(chunkCoords.x, chunkCoords.y, chunkCoords.z);
        
        const localX = x - (chunkCoords.x * this.chunkSize);
        const localY = y - (chunkCoords.y * this.chunkSize);
        const localZ = z - (chunkCoords.z * this.chunkSize);
        
        chunk.setBlock(localX, localY, localZ, blockType);
    }

    /**
     * Get block at world position
     */
    getBlock(x, y, z) {
        const chunkCoords = this.getChunkCoords(x, y, z);
        const key = `${chunkCoords.x}_${chunkCoords.y}_${chunkCoords.z}`;
        
        if (!this.loadedChunks.has(key)) {
            return 0; // Air
        }

        const chunk = this.loadedChunks.get(key);
        const localX = x - (chunkCoords.x * this.chunkSize);
        const localY = y - (chunkCoords.y * this.chunkSize);
        const localZ = z - (chunkCoords.z * this.chunkSize);
        
        return chunk.getBlock(localX, localY, localZ);
    }

    /**
     * Raycast for block intersection
     */
    raycastBlock(origin, direction, maxDistance = 100) {
        const step = 0.1;
        let distance = 0;

        while (distance < maxDistance) {
            const x = Math.floor(origin.x + direction.x * distance);
            const y = Math.floor(origin.y + direction.y * distance);
            const z = Math.floor(origin.z + direction.z * distance);

            const block = this.getBlock(x, y, z);
            
            if (block > 0) {
                return {
                    position: { x, y, z },
                    block,
                    distance,
                    normal: this.getBlockNormal(origin, direction, distance)
                };
            }

            distance += step;
        }

        return null;
    }

    /**
     * Get block normal for raycasting
     */
    getBlockNormal(origin, direction, distance) {
        const hitPoint = {
            x: origin.x + direction.x * distance,
            y: origin.y + direction.y * distance,
            z: origin.z + direction.z * distance
        };

        const x = Math.floor(hitPoint.x);
        const y = Math.floor(hitPoint.y);
        const z = Math.floor(hitPoint.z);

        const offset = {
            x: hitPoint.x - x - 0.5,
            y: hitPoint.y - y - 0.5,
            z: hitPoint.z - z - 0.5
        };

        const absX = Math.abs(offset.x);
        const absY = Math.abs(offset.y);
        const absZ = Math.abs(offset.z);

        if (absX > absY && absX > absZ) {
            return { x: offset.x > 0 ? 1 : -1, y: 0, z: 0 };
        } else if (absY > absX && absY > absZ) {
            return { x: 0, y: offset.y > 0 ? 1 : -1, z: 0 };
        } else {
            return { x: 0, y: 0, z: offset.z > 0 ? 1 : -1 };
        }
    }

    /**
     * Dispose of world resources
     */
    dispose() {
        for (const chunk of this.loadedChunks.values()) {
            chunk.dispose();
        }
        this.loadedChunks.clear();
    }
}
