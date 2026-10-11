# Benchcraft - 3D Voxel Engine

A Minecraft-inspired 3D voxel engine built with Three.js and WebGL.

## Features
- **Infinite Voxel World** - Procedurally generated terrain with chunk-based loading
- **Block System** - Place and destroy blocks in real-time
- **Physics** - Gravity, collisions, and smooth movement
- **Player Controls** - WASD movement, mouse look, spacebar to jump
- **Chunk Optimization** - LOD and frustum culling for performance
- **Multiple Block Types** - Grass, dirt, stone, water, and more

## Getting Started

### Prerequisites
- Node.js 16+
- A modern web browser with WebGL support

### Installation
```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser.

## Project Structure
```
benchcraft/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── index.js           # Entry point
│   ├── world/
│   │   ├── World.js       # World manager
│   │   ├── Chunk.js       # Chunk system
│   │   └── Terrain.js     # Terrain generation (Perlin noise)
│   ├── blocks/
│   │   ├── BlockTypes.js  # Block definitions
│   │   └── BlockMesh.js   # Mesh generation
│   ├── player/
│   │   ├── Player.js      # Player controller
│   │   └── Camera.js      # First-person camera
│   ├── physics/
│   │   └── Physics.js     # Physics engine
│   ├── rendering/
│   │   ├── Renderer.js    # Three.js renderer
│   │   └── Materials.js   # Block materials/textures
│   └── utils/
│       ├── Noise.js       # Perlin noise
│       └── Math.js        # Utility functions
├── package.json
└── webpack.config.js      # Build configuration
```

## Controls
- **W/A/S/D** - Move forward/left/backward/right
- **Mouse** - Look around
- **Space** - Jump
- **Left Click** - Destroy block
- **Right Click** - Place block
- **Escape** - Toggle mouse lock

## Development

### Build
```bash
npm run build
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build:prod
```

## Performance Tips
- Chunk size: 32x32x32 voxels per chunk
- Render distance: 8-16 chunks
- LOD system for distant chunks
- Greedy meshing for efficient vertices

## License
Eclipse Public License 2.0 (EPL-2.0)
