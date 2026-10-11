import * as THREE from 'three';
import { World } from './world/World';
import { Player } from './player/Player';
import { Renderer } from './rendering/Renderer';
import { InputHandler } from './input/InputHandler';

// Global state
const app = {
    camera: null,
    scene: null,
    renderer: null,
    world: null,
    player: null,
    inputHandler: null,
    lastTime: Date.now(),
    frameCount: 0,
    fps: 0,
    stats: {
        totalBlocks: 0,
        totalChunks: 0
    }
};

// Initialize the application
async function init() {
    // Create scene and camera
    app.scene = new THREE.Scene();
    app.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    app.scene.fog = new THREE.Fog(0x87ceeb, 200, 500);

    app.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    app.camera.position.set(0, 100, 0);

    // Create renderer
    app.renderer = new Renderer(app.scene, app.camera);

    // Create world
    app.world = new World(app.scene, {
        chunkSize: 32,
        renderDistance: 12,
        seed: Math.random() * 10000
    });

    // Create player
    app.player = new Player(app.camera, app.world);
    app.player.position.set(0, 100, 0);

    // Setup input handler
    app.inputHandler = new InputHandler(app.camera, app.world, app.player);

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start game loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const currentTime = Date.now();
    const deltaTime = (currentTime - app.lastTime) / 1000;
    app.lastTime = currentTime;

    // Update player
    app.player.update(deltaTime, app.inputHandler);

    // Update world (load/unload chunks)
    app.world.update(app.player.position);

    // Update input
    app.inputHandler.update(deltaTime);

    // Render
    app.renderer.render(app.scene, app.camera);

    // Update UI
    updateUI();

    app.frameCount++;
}

function updateUI() {
    const now = Date.now();
    const timeSinceLastUpdate = now - (app.lastFpsUpdate || now);
    
    if (timeSinceLastUpdate >= 1000) {
        app.fps = app.frameCount;
        app.frameCount = 0;
        app.lastFpsUpdate = now;
    }

    document.getElementById('fps').textContent = app.fps;
    document.getElementById('chunks').textContent = app.world.loadedChunks.size;
    document.getElementById('blocks').textContent = app.stats.totalBlocks;
    
    const pos = app.player.position;
    document.getElementById('position').textContent = 
        `${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}, ${pos.z.toFixed(1)}`;
}

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    app.camera.aspect = width / height;
    app.camera.updateProjectionMatrix();

    app.renderer.setSize(width, height);
}

// Start the application
init().catch(error => {
    console.error('Failed to initialize Benchcraft:', error);
    alert('Failed to load Benchcraft. Check console for errors.');
});

// Export for debugging
window.benchcraft = app;
