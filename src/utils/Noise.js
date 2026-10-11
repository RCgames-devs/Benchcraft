export class SimplexNoise {
  constructor(seed = 0) {
    this.seed = seed;
  }

  perlin2D(x, y) {
    const xi = Math.floor(x) % 256;
    const yi = Math.floor(y) % 256;
    
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const n00 = this.grad2D(xi, yi, xf, yf);
    const n10 = this.grad2D(xi + 1, yi, xf - 1, yf);
    const n01 = this.grad2D(xi, yi + 1, xf, yf - 1);
    const n11 = this.grad2D(xi + 1, yi + 1, xf - 1, yf - 1);

    const nx0 = this.lerp(n00, n10, u);
    const nx1 = this.lerp(n01, n11, u);
    
    return this.lerp(nx0, nx1, v);
  }

  grad2D(xi, yi, xf, yf) {
    const h = this.hash(xi + this.hash(yi + this.seed));
    const g = h & 3;
    const g00 = g === 0 ? xf : g === 1 ? yf : -xf;
    const g01 = g === 0 ? yf : g === 1 ? -xf : -yf;
    return g00 * xf + g01 * yf;
  }

  hash(x) {
    x = ((x >> 16) ^ x) * 0x7feb352d;
    x = ((x >> 15) ^ x) * 0x846ca68b;
    x = ((x >> 16) ^ x);
    return x & 0xff;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  octavePerlin2D(x, y, octaves, persistence, scale) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.perlin2D(x * frequency / scale, y * frequency / scale) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return value / maxValue;
  }
}
