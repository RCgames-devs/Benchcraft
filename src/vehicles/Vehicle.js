import * as THREE from 'three';

export class Vehicle {
  constructor(type = 'car', position = new THREE.Vector3(0, 0, 0)) {
    this.type = type;
    this.position = position.clone();
    this.velocity = new THREE.Vector3();
    this.rotation = new THREE.Euler(0, 0, 0);
    this.mesh = null;
    this.speed = 0;
    this.maxSpeed = type === 'plane' ? 30 : type === 'boat' ? 10 : 20;
    this.acceleration = 0.5;
    this.friction = 0.95;
    this.health = 100;
    this.fuel = 100;
    this.passengers = [];
    this.isActive = false;
    this.createMesh();
  }

  createMesh() {
    const group = new THREE.Group();
    group.position.copy(this.position);

    switch (this.type) {
      case 'car':
        this.createCar(group);
        break;
      case 'plane':
        this.createPlane(group);
        break;
      case 'boat':
        this.createBoat(group);
        break;
      case 'go_kart':
        this.createGoKart(group);
        break;
    }

    this.mesh = group;
  }

  createCar(group) {
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheelPositions = [
      [-0.8, 0.6, 1],
      [0.8, 0.6, 1],
      [-0.8, 0.6, -1],
      [0.8, 0.6, -1]
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      group.add(wheel);
    });
  }

  createPlane(group) {
    const fuselageGeometry = new THREE.CylinderGeometry(0.4, 0.4, 6, 8);
    const fuselageMaterial = new THREE.MeshLambertMaterial({ color: 0x4488ff });
    const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
    fuselage.rotation.z = Math.PI / 2;
    fuselage.castShadow = true;
    group.add(fuselage);

    const wingGeometry = new THREE.BoxGeometry(12, 0.2, 3);
    const wingMaterial = new THREE.MeshLambertMaterial({ color: 0x4488ff });
    const wing = new THREE.Mesh(wingGeometry, wingMaterial);
    wing.position.y = 0.5;
    wing.castShadow = true;
    group.add(wing);

    const tailGeometry = new THREE.BoxGeometry(0.2, 2, 2);
    const tail = new THREE.Mesh(tailGeometry, wingMaterial);
    tail.position.set(0, 0, -2);
    tail.castShadow = true;
    group.add(tail);
  }

  createBoat(group) {
    const hullGeometry = new THREE.BoxGeometry(3, 1, 6);
    const hullMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.position.y = 0.3;
    hull.castShadow = true;
    group.add(hull);

    const cabinGeometry = new THREE.BoxGeometry(2, 1.5, 2);
    const cabinMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.2, -1);
    cabin.castShadow = true;
    group.add(cabin);
  }

  createGoKart(group) {
    const frameGeometry = new THREE.BoxGeometry(1.2, 0.6, 2);
    const frameMaterial = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 0.5;
    frame.castShadow = true;
    group.add(frame);

    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const wheelPositions = [
      [-0.6, 0.4, 0.6],
      [0.6, 0.4, 0.6],
      [-0.6, 0.4, -0.6],
      [0.6, 0.4, -0.6]
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.castShadow = true;
      group.add(wheel);
    });
  }

  update(dt, input = {}) {
    if (!this.isActive) return;

    if (input.forward) {
      this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    } else if (input.backward) {
      this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed * 0.5);
    } else {
      this.speed *= this.friction;
    }

    if (input.left) {
      this.rotation.y += 0.05;
    }
    if (input.right) {
      this.rotation.y -= 0.05;
    }

    const direction = new THREE.Vector3(Math.sin(this.rotation.y), 0, Math.cos(this.rotation.y));
    this.velocity.copy(direction).multiplyScalar(this.speed * dt);
    this.position.add(this.velocity);

    if (this.mesh) {
      this.mesh.position.copy(this.position);
      this.mesh.rotation.copy(this.rotation);
    }

    this.fuel = Math.max(0, this.fuel - (Math.abs(this.speed) * 0.001));
  }

  addPassenger(player) {
    this.passengers.push(player);
    return true;
  }

  removePassenger(player) {
    const index = this.passengers.indexOf(player);
    if (index > -1) {
      this.passengers.splice(index, 1);
      return true;
    }
    return false;
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health > 0;
  }

  repair(amount) {
    this.health = Math.min(100, this.health + amount);
  }
}
