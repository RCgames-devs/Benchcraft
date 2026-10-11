import * as THREE from 'three';

export class Player {
  constructor(world) {
    this.world = world;
    this.position = new THREE.Vector3(0, 10, 10);
    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = -0.25;
    this.onGround = false;
    this.radius = 0.35;
    this.height = 1.8;
    this.speed = 6;
    this.jumpStrength = 6.5;
  }

  update(dt, input) {
    this.handleMovement(input, dt);
    this.handleGravity(dt);
    this.handleCollisions();
  }

  handleMovement(input, dt) {
    const forward = new THREE.Vector3(Math.sin(this.yaw), 0, Math.cos(this.yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    const move = new THREE.Vector3();
    if (input.w) move.add(forward);
    if (input.s) move.sub(forward);
    if (input.a) move.sub(right);
    if (input.d) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(this.speed * dt);
      
      const newX = this.position.x + move.x;
      if (!this.isBlocked(newX, this.position.y + 0.5, this.position.z)) {
        this.position.x = newX;
      }

      const newZ = this.position.z + move.z;
      if (!this.isBlocked(this.position.x, this.position.y + 0.5, newZ)) {
        this.position.z = newZ;
      }
    }

    if (input.space && this.onGround) {
      this.velocity.y = this.jumpStrength;
      this.onGround = false;
    }
  }

  handleGravity(dt) {
    this.velocity.y -= 20 * dt;
    this.position.y += this.velocity.y * dt;
  }

  handleCollisions() {
    const groundY = Math.floor(this.position.y - 0.1);
    const standingOnGround = this.world.getBlockAt(
      Math.floor(this.position.x),
      groundY,
      Math.floor(this.position.z)
    ) !== 0;

    if (standingOnGround && this.velocity.y <= 0) {
      const topBlockY = Math.floor(this.position.y);
      this.position.y = topBlockY + 1.8;
      this.velocity.y = 0;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    if (this.position.y < 3) {
      this.position.y = 3;
      this.velocity.y = 0;
      this.onGround = true;
    }
  }

  isBlocked(x, y, z) {
    const px = Math.floor(x);
    const py = Math.floor(y);
    const pz = Math.floor(z);

    const block = this.world.getBlockAt(px, py, pz);
    return block !== 0;
  }

  raycast(direction, maxDistance = 6) {
    const step = 0.05;
    const current = this.position.clone().add(new THREE.Vector3(0, 1.6, 0));

    for (let distance = 0; distance <= maxDistance; distance += step) {
      const x = Math.floor(current.x);
      const y = Math.floor(current.y);
      const z = Math.floor(current.z);

      const block = this.world.getBlockAt(x, y, z);
      if (block !== 0) {
        const prev = current.clone().addScaledVector(direction, -step);
        const prevX = Math.floor(prev.x);
        const prevY = Math.floor(prev.y);
        const prevZ = Math.floor(prev.z);

        const normal = new THREE.Vector3(
          Math.sign(x - prevX),
          Math.sign(y - prevY),
          Math.sign(z - prevZ)
        );

        return { x, y, z, normal, block };
      }

      current.addScaledVector(direction, step);
    }

    return null;
  }
}
