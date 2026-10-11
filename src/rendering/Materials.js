import * as THREE from 'three';
import { BlockTypes } from '../blocks/BlockTypes';

export const BlockMaterials = {
  [BlockTypes.GRASS]: new THREE.MeshLambertMaterial({ color: 0x5abf55 }),
  [BlockTypes.DIRT]: new THREE.MeshLambertMaterial({ color: 0x8a5a3a }),
  [BlockTypes.STONE]: new THREE.MeshLambertMaterial({ color: 0x7f8b96 }),
  [BlockTypes.SAND]: new THREE.MeshLambertMaterial({ color: 0xd9c07a }),
  [BlockTypes.WATER]: new THREE.MeshLambertMaterial({
    color: 0x4ba3ff,
    transparent: true,
    opacity: 0.55
  }),
  [BlockTypes.WOOD]: new THREE.MeshLambertMaterial({ color: 0x9d6c3d }),
  [BlockTypes.LEAVES]: new THREE.MeshLambertMaterial({ color: 0x4fa94d })
};

export function getMaterialForBlock(blockType) {
  return BlockMaterials[blockType] || BlockMaterials[1];
}
