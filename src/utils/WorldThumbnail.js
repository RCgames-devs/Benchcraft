export class WorldThumbnail {
  constructor(worldData) {
    this.worldData = worldData;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 180;
    this.ctx = this.canvas.getContext('2d');
    this.generate();
  }

  generate() {
    const seed = parseInt(this.worldData.seed, 36) % 256;
    const width = this.canvas.width;
    const height = this.canvas.height;

    const imageData = this.ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < width * height; i++) {
      const x = i % width;
      const y = Math.floor(i / width);

      let value =
        Math.sin((x * 0.01 + seed) * 0.5) * 0.5 + 0.5 +
        Math.cos((y * 0.01 + seed) * 0.3) * 0.3;
      value = Math.max(0, Math.min(1, value));

      let color;
      if (value < 0.3) {
        color = [100, 150, 200];
      } else if (value < 0.5) {
        color = [100, 180, 100];
      } else if (value < 0.7) {
        color = [150, 120, 80];
      } else {
        color = [80, 60, 40];
      }

      data[i * 4] = color[0];
      data[i * 4 + 1] = color[1];
      data[i * 4 + 2] = color[2];
      data[i * 4 + 3] = 255;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  getDataURL() {
    return this.canvas.toDataURL();
  }
}
