import { BlockTypes } from '../blocks/BlockTypes';

export class Physics {
  constructor(world) {
    this.world = world;
    this.gravity = 20;
    this.frictionGround = 0.8;
    this.frictionAir = 0.95;
  }

  isSolidBlock(blockType) {
    return blockType !== BlockTypes.AIR && blockType !== BlockTypes.WATER;
  }

  isBlockSolid(x, y, z) {
    const blockType = this.world.getBlockAt(Math.floor(x), Math.floor(y), Math.floor(z));
    return this.isSolidBlock(blockType);
  }

  checkCollision(position, radius, height) {
    const checkPoints = [
      { x: 0, y: 0, z: 0 },
      { x: radius, y: 0, z: 0 },
      { x: -radius, y: 0, z: 0 },
      { x: 0, y: 0, z: radius },
      { x: 0, y: 0, z: -radius },
      { x: 0, y: height * 0.5, z: 0 }
    ];

    for (const point of checkPoints) {
      if (this.isBlockSolid(position.x + point.x, position.y + point.y, position.z + point.z)) {
        return true;
      }
    }
    return false;
  }

  isOnGround(position, radius) {
    return this.isBlockSolid(
      position.x,
      position.y - 0.1,
      position.z
    );
  }

  updateVelocity(velocity, onGround, dt) {
    if (!onGround) {
      velocity.y -= this.gravity * dt;
    }
  }
}
