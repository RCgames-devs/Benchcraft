import * as THREE from 'three';

export class FirstPersonCamera {
  constructor(position = new THREE.Vector3(0, 0, 0)) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.copy(position);
    this.yaw = 0;
    this.pitch = 0;
  }

  update(position, yaw, pitch) {
    this.camera.position.copy(position);
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = yaw;
    this.camera.rotation.x = pitch;
  }

  getDirection() {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
