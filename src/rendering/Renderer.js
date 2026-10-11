import * as THREE from 'three';

export class GameRenderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    document.body.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  setSize(width, height) {
    this.renderer.setSize(width, height);
  }

  setClearColor(color, alpha) {
    this.renderer.setClearColor(color, alpha);
  }
}
