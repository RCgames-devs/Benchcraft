export class InventoryUI {
  constructor(inventory) {
    this.inventory = inventory;
    this.isOpen = false;
    this.createUI();
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'inventoryUI';
    container.className = 'inventory-ui hidden';
    container.innerHTML = `
      <div class="inventory-panel">
        <h3>Inventory</h3>
        <div class="inventory-grid" id="inventoryGrid"></div>
        <div class="inventory-info" id="inventoryInfo"></div>
      </div>
    `;
    document.body.appendChild(container);
    this.container = container;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.container.classList.toggle('hidden', !this.isOpen);
    if (this.isOpen) {
      this.render();
    }
  }

  render() {
    const grid = document.getElementById('inventoryGrid');
    grid.innerHTML = '';

    for (let i = 0; i < this.inventory.maxSlots; i++) {
      const slot = this.inventory.getSlot(i);
      const slotEl = document.createElement('div');
      slotEl.className = `inventory-slot ${slot.type ? 'filled' : ''} ${i === this.inventory.selectedSlot ? 'selected' : ''}`;
      slotEl.innerHTML = `
        ${slot.type ? `<span class="item-name">${slot.type}</span>` : ''}
        ${slot.amount > 1 ? `<span class="item-amount">${slot.amount}</span>` : ''}
      `;
      slotEl.addEventListener('click', () => this.inventory.selectSlot(i));
      grid.appendChild(slotEl);
    }
  }
}
