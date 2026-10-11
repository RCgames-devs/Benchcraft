export class CraftingUI {
  constructor(inventory, craftingRecipes) {
    this.inventory = inventory;
    this.recipes = craftingRecipes;
    this.isOpen = false;
    this.selectedRecipe = null;
    this.createUI();
  }

  createUI() {
    const container = document.createElement('div');
    container.id = 'craftingUI';
    container.className = 'crafting-ui hidden';
    container.innerHTML = `
      <div class="crafting-panel">
        <h3>Crafting</h3>
        <div class="recipes-list" id="recipesList"></div>
        <div class="recipe-details">
          <div id="recipeInfo"></div>
          <button id="craftBtn" class="btn btn-primary">Craft</button>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    this.container = container;
    this.setupListeners();
  }

  setupListeners() {
    document.getElementById('craftBtn').addEventListener('click', () => this.craft());
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.container.classList.toggle('hidden', !this.isOpen);
    if (this.isOpen) {
      this.updateRecipesList();
    }
  }

  updateRecipesList() {
    const list = document.getElementById('recipesList');
    list.innerHTML = '';

    for (const [name, recipe] of Object.entries(this.recipes)) {
      const recipeEl = document.createElement('div');
      recipeEl.className = 'recipe-item';
      recipeEl.innerHTML = `<span>${name}</span>`;
      recipeEl.addEventListener('click', () => this.selectRecipe(name, recipe));
      list.appendChild(recipeEl);
    }
  }

  selectRecipe(name, recipe) {
    this.selectedRecipe = { name, recipe };
    this.updateRecipeInfo(recipe);
  }

  updateRecipeInfo(recipe) {
    const info = document.getElementById('recipeInfo');
    const canCraft = this.inventory.canCraft(recipe);

    let html = '<h4>Recipe</h4>';
    html += '<div class="ingredients">';
    for (const [item, amount] of Object.entries(recipe.ingredients)) {
      html += `<div class="ingredient">${item}: ${amount}</div>`;
    }
    html += '</div>';
    html += `<div class="result">Result: ${recipe.result.type} x${recipe.result.amount}</div>`;
    html += `<div class="can-craft ${canCraft ? 'yes' : 'no'}">${
      canCraft ? 'Can craft' : 'Missing ingredients'
    }</div>`;

    info.innerHTML = html;
  }

  craft() {
    if (this.selectedRecipe && this.inventory.craft(this.selectedRecipe.recipe)) {
      this.updateRecipesList();
      this.updateRecipeInfo(this.selectedRecipe.recipe);
    }
  }
}
