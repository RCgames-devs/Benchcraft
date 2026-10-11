export class InputHandler {
  constructor() {
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      space: false
    };
    this.mouse = {
      x: 0,
      y: 0,
      locked: false
    };
    this.clicks = {
      left: false,
      right: false
    };

    this.setupListeners();
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    document.addEventListener('pointerlockchange', () => this.handlePointerLockChange());
  }

  handleKeyDown(e) {
    const key = e.code.toLowerCase();
    if (key === 'keyw') this.keys.w = true;
    if (key === 'keya') this.keys.a = true;
    if (key === 'keys') this.keys.s = true;
    if (key === 'keyd') this.keys.d = true;
    if (key === 'space') {
      this.keys.space = true;
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    const key = e.code.toLowerCase();
    if (key === 'keyw') this.keys.w = false;
    if (key === 'keya') this.keys.a = false;
    if (key === 'keys') this.keys.s = false;
    if (key === 'keyd') this.keys.d = false;
    if (key === 'space') this.keys.space = false;
  }

  handleMouseMove(e) {
    if (!this.mouse.locked) return;
    this.mouse.x = e.movementX * 0.002;
    this.mouse.y = e.movementY * 0.0018;
  }

  handleMouseDown(e) {
    if (e.button === 0) this.clicks.left = true;
    if (e.button === 2) this.clicks.right = true;
  }

  handleMouseUp(e) {
    if (e.button === 0) this.clicks.left = false;
    if (e.button === 2) this.clicks.right = false;
  }

  handlePointerLockChange() {
    this.mouse.locked = document.pointerLockElement === document.body;
  }

  requestPointerLock() {
    if (document.body.requestPointerLock) {
      document.body.requestPointerLock();
    }
  }

  getInput() {
    return {
      w: this.keys.w,
      a: this.keys.a,
      s: this.keys.s,
      d: this.keys.d,
      space: this.keys.space
    };
  }

  getMouseDelta() {
    const delta = { x: this.mouse.x, y: this.mouse.y };
    this.mouse.x = 0;
    this.mouse.y = 0;
    return delta;
  }

  isPointerLocked() {
    return this.mouse.locked;
  }
}
