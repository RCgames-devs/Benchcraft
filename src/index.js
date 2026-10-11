import * as THREE from 'three';

const WORLD_SIZE = 24;
const TERRAIN_HEIGHT = 6;
const HALF_SIZE = WORLD_SIZE / 2;
const BLOCK_SIZE = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb, 15, 60);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, 10);

const world = new THREE.Group();
scene.add(world);

const ambient = new THREE.HemisphereLight(0xffffff, 0x496a99, 1.2);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 1.0);
sun.position.set(20, 25, 10);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
scene.add(sun);

const blockMaterials = {
  grass: new THREE.MeshLambertMaterial({ color: 0x5abf55 }),
  dirt: new THREE.MeshLambertMaterial({ color: 0x8a5a3a }),
  stone: new THREE.MeshLambertMaterial({ color: 0x7f8b96 }),
  sand: new THREE.MeshLambertMaterial({ color: 0xd9c07a }),
  water: new THREE.MeshLambertMaterial({ color: 0x4ba3ff, transparent: true, opacity: 0.55 }),
  wood: new THREE.MeshLambertMaterial({ color: 0x9d6c3d }),
  leaves: new THREE.MeshLambertMaterial({ color: 0x4fa94d })
};

const blockMap = new Map();
const blocks = [];

function keyFor(x, y, z) {
  return `${x},${y},${z}`;
}

function blockAt(x, y, z) {
  return blockMap.get(keyFor(x, y, z)) || null;
}

function setBlock(x, y, z, type) {
  const current = blockAt(x, y, z);
  if (current) {
    world.remove(current.mesh);
    blockMap.delete(keyFor(x, y, z));
  }

  const material = blockMaterials[type];
  if (!material) return;

  const mesh = new THREE.Mesh(new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE), material);
  mesh.position.set(x + 0.5, y + 0.5, z + 0.5);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  world.add(mesh);

  blockMap.set(keyFor(x, y, z), { type, mesh });
  blocks.push({ x, y, z, type, mesh });
}

function removeBlock(x, y, z) {
  const current = blockAt(x, y, z);
  if (!current) return;
  world.remove(current.mesh);
  blockMap.delete(keyFor(x, y, z));
}

function terrainHeight(x, z) {
  const waveA = Math.sin(x * 0.75) * 1.5;
  const waveB = Math.cos(z * 0.8) * 1.3;
  const waveC = Math.sin((x + z) * 0.45) * 2.2;
  return Math.max(2, Math.floor(TERRAIN_HEIGHT + waveA + waveB + waveC));
}

function buildTerrain() {
  for (let x = -HALF_SIZE; x < HALF_SIZE; x++) {
    for (let z = -HALF_SIZE; z < HALF_SIZE; z++) {
      const h = terrainHeight(x, z);
      for (let y = 0; y < h; y++) {
        let type = 'stone';
        if (y === h - 1) {
          type = 'grass';
        } else if (y >= h - 3) {
          type = 'dirt';
        }

        if (y < 1) type = 'sand';

        setBlock(x, y, z, type);
      }

      if (Math.random() < 0.08) {
        const treeHeight = 2 + Math.floor(Math.random() * 3);
        for (let ty = h; ty < h + treeHeight; ty++) {
          setBlock(x, ty, z, 'wood');
        }
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = 0; dy <= 2; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
              if (Math.abs(dx) + Math.abs(dz) < 2 || dy === 0) {
                setBlock(x + dx, h + treeHeight - 1 + dy, z + dz, 'leaves');
              }
            }
          }
        }
      }
    }
  }
}

buildTerrain();

const player = {
  position: new THREE.Vector3(0, 10, 10),
  velocity: new THREE.Vector3(),
  yaw: 0,
  pitch: -0.25,
  onGround: false,
  speed: 6,
  jumpStrength: 6.5,
  radius: 0.35,
  height: 1.8
};

const pressed = {};
let pointerLocked = false;
const message = document.getElementById('message');
const fpsEl = document.getElementById('fps');
const positionEl = document.getElementById('position');
const blockCountEl = document.getElementById('blockCount');

function showMessage(text) {
  message.textContent = text;
  message.classList.add('visible');
  clearTimeout(showMessage._timer);
  showMessage._timer = setTimeout(() => message.classList.remove('visible'), 1200);
}

window.addEventListener('click', () => {
  if (!pointerLocked && document.body.requestPointerLock) {
    document.body.requestPointerLock();
  }
});

document.addEventListener('pointerlockchange', () => {
  pointerLocked = document.pointerLockElement === document.body;
  if (!pointerLocked) {
    showMessage('Click to lock pointer');
  }
});

document.addEventListener('mousemove', (event) => {
  if (!pointerLocked) return;
  player.yaw -= event.movementX * 0.002;
  player.pitch -= event.movementY * 0.0018;
  player.pitch = Math.max(-1.4, Math.min(1.4, player.pitch));
});

document.addEventListener('keydown', (event) => {
  pressed[event.code] = true;
  if (event.code === 'Space' && player.onGround) {
    player.velocity.y = player.jumpStrength;
    player.onGround = false;
  }
});

document.addEventListener('keyup', (event) => {
  pressed[event.code] = false;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('contextmenu', (event) => event.preventDefault());

document.addEventListener('mousedown', (event) => {
  if (!pointerLocked) return;

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  const hit = raycast(camera.position, dir, 6);

  if (event.button === 0 && hit) {
    removeBlock(hit.x, hit.y, hit.z);
    showMessage('Removed block');
  }

  if (event.button === 2 && hit) {
    const nx = hit.x + hit.normal.x;
    const ny = hit.y + hit.normal.y;
    const nz = hit.z + hit.normal.z;

    if (!isBlocked(nx, ny, nz)) {
      setBlock(nx, ny, nz, 'stone');
      showMessage('Placed block');
    }
  }
});

function isSolidAt(x, y, z) {
  return !!blockAt(Math.floor(x), Math.floor(y), Math.floor(z));
}

function isBlocked(x, y, z) {
  const px = Math.floor(x);
  const py = Math.floor(y);
  const pz = Math.floor(z);

  if (Math.abs(px - player.position.x) < 0.8 && Math.abs(pz - player.position.z) < 0.8 && py >= Math.floor(player.position.y) && py <= Math.floor(player.position.y + player.height)) {
    return true;
  }

  return isSolidAt(px, py, pz);
}

function raycast(origin, direction, maxDistance = 6) {
  const step = 0.05;
  let current = origin.clone();

  for (let distance = 0; distance <= maxDistance; distance += step) {
    const x = Math.floor(current.x);
    const y = Math.floor(current.y);
    const z = Math.floor(current.z);

    if (blockAt(x, y, z)) {
      const prev = current.clone().addScaledVector(direction, -step);
      const prevX = Math.floor(prev.x);
      const prevY = Math.floor(prev.y);
      const prevZ = Math.floor(prev.z);
      const normal = new THREE.Vector3(
        x - prevX,
        y - prevY,
        z - prevZ
      );
      return { x, y, z, normal: normal.normalize() };
    }

    current.addScaledVector(direction, step);
  }

  return null;
}

function updatePlayer(dt) {
  const forward = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  const right = new THREE.Vector3(forward.z, 0, -forward.x);

  const move = new THREE.Vector3();
  if (pressed['KeyW']) move.add(forward);
  if (pressed['KeyS']) move.sub(forward);
  if (pressed['KeyA']) move.sub(right);
  if (pressed['KeyD']) move.add(right);

  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(player.speed * dt);
    const newPos = player.position.clone();
    newPos.x += move.x;
    if (!isBlocked(newPos.x, player.position.y + 0.5, player.position.z)) {
      player.position.x = newPos.x;
    }
    newPos.z += move.z;
    if (!isBlocked(player.position.x, player.position.y + 0.5, newPos.z)) {
      player.position.z = newPos.z;
    }
  }

  player.velocity.y -= 20 * dt;
  player.position.y += player.velocity.y * dt;

  const feetY = Math.floor(player.position.y);
  const groundY = feetY;
  const groundCheckY = Math.floor(player.position.y - 0.1);

  const standingOnGround = isSolidAt(Math.floor(player.position.x), groundCheckY, Math.floor(player.position.z));
  if (standingOnGround && player.velocity.y <= 0) {
    const top = Math.floor(player.position.y);
    const topBlock = Math.max(0, top);
    const blockHeight = topBlock + 1.8;
    player.position.y = blockHeight;
    player.velocity.y = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  if (player.position.y < 3) {
    player.position.y = 3;
    player.velocity.y = 0;
    player.onGround = true;
  }

  camera.position.set(player.position.x, player.position.y + 1.6, player.position.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = player.yaw;
  camera.rotation.x = player.pitch;
}

const clock = new THREE.Clock();
let lastFrame = performance.now();
let frames = 0;
let fpsTimer = 0;

function animate() {
  const now = performance.now();
  const dt = Math.min(0.03, (now - lastFrame) / 1000 || 0.016);
  lastFrame = now;

  updatePlayer(dt);

  frames += 1;
  fpsTimer += dt;
  if (fpsTimer >= 0.5) {
    const fps = Math.round(frames / fpsTimer);
    fpsEl.textContent = String(fps);
    frames = 0;
    fpsTimer = 0;
  }

  const pos = player.position;
  positionEl.textContent = `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
  blockCountEl.textContent = String(blockMap.size);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

showMessage('Benchcraft prototype loaded');
requestAnimationFrame(animate);
