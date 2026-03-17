// recipes.js
// 制作（レシピ）関連ロジック

function renderRecipeList() {
  showRecipes = true;
  let overlay = select('#infoOverlay');
  if (overlay) overlay.html('');
  let oldList = select('#recipeList');
  if (oldList) oldList.remove();
  let oldBtns = select('#craftButtons');
  if (oldBtns) oldBtns.remove();
  let oldH2 = select('#recipeH2');
  if (oldH2) oldH2.remove();

  let rH2 = createElement('h2', '制作レシピ').parent(leftTop);
  rH2.id('recipeH2');
  rH2.style('margin', '0 0 6px 0');

  let listDiv = createDiv().id('recipeList').parent(leftTop);
  for (let name in recipes) {
    let r = recipes[name];
    let reqStr = Object.entries(r.req).map(([k, v]) => `${k}×${v}`).join(' ＆ ');
    let label = r.weapon ? `⚔ ${name}` : name;
    let canCraft = Object.entries(r.req).every(([item, num]) => (itemCounts[item] || 0) >= num);
    let marker = canCraft ? '<span style="color:var(--accent)">〇 </span>' : '<span style="color:var(--text-faint)">× </span>';
    let div = createDiv(`${marker}${label}：${reqStr}（${r.time}時間）`).parent(listDiv);
    div.class('item-entry');
    if (selectedRecipe === name) div.addClass('selected');
    div.elt.addEventListener('click', (function(n) {
      return function() { selectedRecipe = n; renderRecipeList(); showRecipeDescription(n); };
    })(name));
  }

  let btnDiv = createDiv().id('craftButtons').parent(leftTop);
  let btnCraft = createButton('制作する').parent(btnDiv);
  if (!selectedRecipe) btnCraft.attribute('disabled', 'true');
  btnCraft.mousePressed(() => { if (selectedRecipe) craftItem(selectedRecipe); });
  createButton('閉じる').parent(btnDiv).mousePressed(() => {
    showRecipes = false;
    selectedRecipe = null;
    let oldH2   = select('#recipeH2');   if (oldH2)   oldH2.remove();
    let oldList = select('#recipeList'); if (oldList) oldList.remove();
    let oldBtns = select('#craftButtons'); if (oldBtns) oldBtns.remove();
    updateElapsedTime();
  });
}

function showRecipeDescription(name) {
  let r = recipes[name];
  if (!r) return;
  let text = r.flavor || name;
  if (r.weapon) {
    let w = weapons[name];
    if (w) text += `\n攻撃：${w.atk}`;
  }
  if (r.heal) {
    text += `\n回復量：${r.heal}`;
  }
  showMessage(text, true, () => renderRecipeList());
}

function craftItem(name) {
  let r = recipes[name];
  let missing = [];
  for (let item in r.req) {
    let have = itemCounts[item] || 0;
    let need = r.req[item];
    if (have < need) missing.push(`${item}（あと${need - have}個）`);
  }
  if (missing.length > 0) {
    showMessage(`材料が足りません：${missing.join('、')}`);
    return;
  }
  for (let item in r.req) {
    itemCounts[item] -= r.req[item];
    if (itemCounts[item] <= 0) { delete itemCounts[item]; if (selectedItem === item) selectedItem = null; }
  }
  passTime(r.time);
  addItem(name);
  showMessage(`「${name}」を制作した。（${r.time}時間）`);
  selectedRecipe = null;
  renderRecipeList();
  updateParams();
}
