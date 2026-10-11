export class Inventory {
  constructor(slots = 36) {
    this.maxSlots = slots;
    this.items = [];
    this.selectedSlot = 0;
    this.initializeSlots();
  }

  initializeSlots() {
    for (let i = 0; i < this.maxSlots; i++) {
      this.items[i] = { type: null, amount: 0, durability: 100 };
    }
  }

  addItem(itemType, amount = 1) {
    const item = window.benchcraft?.Items?.[itemType];
    if (!item) return false;

    let remaining = amount;

    if (item.stackable) {
      for (let i = 0; i < this.maxSlots && remaining > 0; i++) {
        const slot = this.items[i];
        if (slot.type === itemType && slot.amount < item.maxStack) {
          const canAdd = Math.min(remaining, item.maxStack - slot.amount);
          slot.amount += canAdd;
          remaining -= canAdd;
        }
      }
    }

    for (let i = 0; i < this.maxSlots && remaining > 0; i++) {
      if (this.items[i].type === null) {
        this.items[i] = {
          type: itemType,
          amount: Math.min(remaining, item.maxStack || 1),
          durability: item.durability || 100
        };
        remaining -= this.items[i].amount;
      }
    }

    return remaining === 0;
  }

  removeItem(slotIndex, amount = 1) {
    if (slotIndex < 0 || slotIndex >= this.maxSlots) return false;

    const slot = this.items[slotIndex];
    if (slot.type === null) return false;

    const removed = Math.min(amount, slot.amount);
    slot.amount -= removed;

    if (slot.amount <= 0) {
      slot.type = null;
      slot.amount = 0;
      slot.durability = 100;
    }

    return true;
  }

  getSlot(index) {
    return this.items[index];
  }

  selectSlot(index) {
    if (index >= 0 && index < this.maxSlots) {
      this.selectedSlot = index;
      return true;
    }
    return false;
  }

  getSelectedItem() {
    return this.getSlot(this.selectedSlot);
  }

  canCraft(recipe) {
    for (const [ingredient, needed] of Object.entries(recipe.ingredients)) {
      let have = 0;
      for (let i = 0; i < this.maxSlots; i++) {
        if (this.items[i].type === ingredient) {
          have += this.items[i].amount;
        }
      }
      if (have < needed) return false;
    }
    return true;
  }

  craft(recipe) {
    if (!this.canCraft(recipe)) return false;

    for (const [ingredient, needed] of Object.entries(recipe.ingredients)) {
      let toRemove = needed;
      for (let i = 0; i < this.maxSlots && toRemove > 0; i++) {
        if (this.items[i].type === ingredient) {
          const removed = Math.min(toRemove, this.items[i].amount);
          this.removeItem(i, removed);
          toRemove -= removed;
        }
      }
    }

    return this.addItem(recipe.result.type, recipe.result.amount);
  }

  getInventoryData() {
    return this.items.map((slot) => ({
      type: slot.type,
      amount: slot.amount,
      durability: slot.durability
    }));
  }
}
