import * as THREE from 'three';
import { WorldManager } from './world/WorldManager';
import { Terrain } from './world/Terrain';
import { Player } from './player/Player';
import { FirstPersonCamera } from './player/Camera';
import { GameRenderer } from './rendering/Renderer';
import { InputHandler } from './input/InputHandler';
import { BlockTypes } from './blocks/BlockTypes';

class BenchcraftApp {
  constructor() {
    this.currentScreen = 'title';
    this.currentWorld = null;
    this.gameActive = false;
    this.worlds = this.loadWorlds();
    this.gameState = null;
    this.setupScreenNavigation();
    this.renderWorldsList();
  }

  setupScreenNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.gameActive) {
        this.togglePauseMenu();
      }
    });
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    this.currentScreen = screenId;
  }

  showTitleScreen() {
    this.stopGame();
    this.showScreen('titleScreen');
  }

  showWorldsScreen() {
    this.stopGame();
    this.renderWorldsList();
    this.showScreen('worldsScreen');
  }

  showCreateWorldScreen() {
    this.showScreen('createWorldScreen');
  }

  showSettings() {
    this.showScreen('settingsScreen');
  }

  showAbout() {
    this.showScreen('aboutScreen');
  }

  renderWorldsList() {
    const worldsList = document.getElementById('worldsList');
    worldsList.innerHTML = '';

    if (this.worlds.length === 0) {
      worldsList.innerHTML =
        '<div class="empty-worlds"><p>No worlds yet. Create one to get started!</p></div>';
      return;
    }

    this.worlds.forEach((world) => {
      const card = document.createElement('div');
      card.className = 'world-card';
      card.innerHTML = `
        <h3>${world.name}</h3>
        <div class="world-info">
          <div>Seed: ${world.seed}</div>
          <div>Gamemode: ${world.gamemode}</div>
          <div>Difficulty: ${world.difficulty}</div>
        </div>
        <div class="world-buttons">
          <button class="play-btn" onclick="app.playWorld('${world.id}')">Play</button>
          <button class="delete-btn" onclick="app.deleteWorld('${world.id}')">Delete</button>
        </div>
      `;
      worldsList.appendChild(card);
    });
  }

  createWorld(event) {
    event.preventDefault();

    const name = document.getElementById('worldName').value;
    const seed = document.getElementById('worldSeed').value || Math.random().toString(36).substr(2, 9);
    const difficulty = document.getElementById('worldDifficulty').value;
    const gamemode = document.getElementById('worldGamemode').value;
    const pvp = document.getElementById('pvpEnabled').checked;

    const world = {
      id: Date.now().toString(),
      name,
      seed,
      difficulty,
      gamemode,
      pvp,
      createdAt: new Date().toISOString()
    };

    this.worlds.push(world);
    this.saveWorlds();
    this.renderWorldsList();
    this.showWorldsScreen();
  }

  playWorld(worldId) {
    const world = this.worlds.find((w) => w.id === worldId);
    if (world) {
      this.currentWorld = world;
      this.startGame(world);
    }
  }

  deleteWorld(worldId) {
    if (confirm('Are you sure you want to delete this world?')) {
      this.worlds = this.worlds.filter((w) => w.id !== worldId);
      this.saveWorlds();
      this.renderWorldsList();
    }
  }

  startGame(world) {
    this.gameActive = true;
    this.showScreen('gameScreen');
    document.getElementById('worldName').textContent = world.name;

    // Setup game
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    // Three.js scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 50, 150);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowShadowMap;

    // Lighting
    const ambient = new THREE.HemisphereLight(0xffffff, 0x496a99, 1.2);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(20, 25, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    scene.add(sun);

    // World and terrain
    const terrain = new Terrain(parseInt(world.seed, 36) % 10000);
    const worldManager = new WorldManager(scene, terrain, 16, 4);

    // Player
    const player = new Player(worldManager);
    player.position.set(0, 30, 0);

    // Input
    const inputHandler = new InputHandler();

    // Game loop
    const clock = new THREE.Clock();
    let lastFrame = performance.now();
    let frames = 0;
    let fpsTimer = 0;

    const animate = () => {
      const now = performance.now();
      const dt = Math.min(0.03, (now - lastFrame) / 1000 || 0.016);
      lastFrame = now;

      if (this.gameActive) {
        const input = inputHandler.getInput();
        const mouseDelta = inputHandler.getMouseDelta();

        player.yaw -= mouseDelta.x;
        player.pitch -= mouseDelta.y;
        player.pitch = Math.max(-1.4, Math.min(1.4, player.pitch));

        player.update(dt, input);
        worldManager.update(player.position);

        camera.position.set(player.position.x, player.position.y + 1.6, player.position.z);
        camera.rotation.order = 'YXZ';
        camera.rotation.y = player.yaw;
        camera.rotation.x = player.pitch;

        // Block interaction
        if (inputHandler.clicks.left) {
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          const hit = player.raycast(direction, 6);
          if (hit) {
            worldManager.setBlockAt(hit.x, hit.y, hit.z, BlockTypes.AIR);
            inputHandler.clicks.left = false;
            this.showMessage('Block removed');
          }
        }

        if (inputHandler.clicks.right) {
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          const hit = player.raycast(direction, 6);
          if (hit) {
            const nx = hit.x + hit.normal.x;
            const ny = hit.y + hit.normal.y;
            const nz = hit.z + hit.normal.z;
            worldManager.setBlockAt(nx, ny, nz, BlockTypes.STONE);
            inputHandler.clicks.right = false;
            this.showMessage('Block placed');
          }
        }

        frames++;
        fpsTimer += dt;
        if (fpsTimer >= 0.5) {
          const fps = Math.round(frames / fpsTimer);
          document.getElementById('fps').textContent = String(fps);
          frames = 0;
          fpsTimer = 0;
        }

        const pos = player.position;
        document.getElementById('position').textContent =
          `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
        document.getElementById('blockCount').textContent = String(worldManager.chunks.size * 16 * 16 * 256);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    this.gameState = {
      scene,
      camera,
      renderer,
      worldManager,
      player,
      inputHandler,
      canvas
    };
  }

  togglePauseMenu() {
    const pauseMenu = document.getElementById('pauseMenu');
    pauseMenu.classList.toggle('hidden');
  }

  resumeGame() {
    document.getElementById('pauseMenu').classList.add('hidden');
  }

  stopGame() {
    this.gameActive = false;
    if (this.gameState) {
      this.gameState.renderer.dispose();
      if (this.gameState.canvas.parentNode) {
        this.gameState.canvas.parentNode.removeChild(this.gameState.canvas);
      }
      this.gameState = null;
    }
  }

  showMessage(text) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.classList.add('visible');
    setTimeout(() => message.classList.remove('visible'), 1200);
  }

  loadWorlds() {
    const stored = localStorage.getItem('benchcraft_worlds');
    return stored ? JSON.parse(stored) : [];
  }

  saveWorlds() {
    localStorage.setItem('benchcraft_worlds', JSON.stringify(this.worlds));
  }
}

window.app = new BenchcraftApp();
