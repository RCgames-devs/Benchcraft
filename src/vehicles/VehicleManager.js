import { Vehicle } from './Vehicle';

export class VehicleManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
  }

  createVehicle(type, position) {
    const vehicle = new Vehicle(type, position);
    if (vehicle.mesh) {
      this.scene.add(vehicle.mesh);
    }
    this.vehicles.push(vehicle);
    return vehicle;
  }

  buildVehicle(vehicleType, position, parts) {
    const vehicle = this.createVehicle(vehicleType, position);
    vehicle.parts = parts;
    return vehicle;
  }

  removeVehicle(vehicle) {
    const index = this.vehicles.indexOf(vehicle);
    if (index > -1) {
      if (vehicle.mesh) {
        this.scene.remove(vehicle.mesh);
      }
      this.vehicles.splice(index, 1);
      return true;
    }
    return false;
  }

  update(dt, activeVehicle = null, input = {}) {
    if (activeVehicle) {
      activeVehicle.update(dt, input);
    }
  }

  getVehiclesInRange(position, range = 10) {
    return this.vehicles.filter((v) => {
      const dist = position.distanceTo(v.position);
      return dist <= range;
    });
  }

  dispose() {
    this.vehicles.forEach((v) => {
      if (v.mesh) {
        this.scene.remove(v.mesh);
      }
    });
    this.vehicles = [];
  }
}
