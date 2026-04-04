// main.js
// ゲームの基本状態、UI構築、メインアクション

// DOM要素
let container, leftWindow, leftTop, leftBottom, textZone, actionPanel, rightWindow;

// プレイヤー
let player = { hp: 100, mp: 50 };
const MAX_HP = 100;
const MAX_MP = 50;

// ゲーム状態
let state = 'opening';
let elapsedTime = 0;
let enemyKillCount = 0;
let battleTurnCount = 0;
let cooldownSearch = 0;
let cooldownGather = 0;

// 探索・層管理
const EXPLORE_LIMIT = 10;
let exploreCounts   = { '広場': 0, '森': 0, '洞窟': 0 };
let exploreCooldown = { '広場': 0, '森': 0, '洞窟': 0 };
let currentPlace = '広場';
let placeLayers = { '森': 0, '洞窟': 0 };
let maxLayers = { '森': 0, '洞窟': 0 };

// アイテム管理
let itemCounts = {};
let hasCampfire = false;
let campfireFuel = 0;
let hasRaft = false;
let selectedItem = null;

// 制作関連
let showRecipes = false;
let selectedRecipe = null;

// ケイ（生存者）管理
let keiState = 'unknown';
let labUnlocked = false;
let labHasKey = false;
let labGunTaken = false;
let labGlueMaterialTaken = false;
let labNaotoMet = false;
let labNaotoDead = false;
let currentRoom = null;
let keiTalkCount = 0;
let forest3EventDone = false;
let forest8EventDone = false;
let keiHealDone = false;
let keiPlazaArrived = false;

function setup() {
  container   = createDiv().id('container');
  document.body.appendChild(container.elt);
  leftWindow  = createDiv().id('leftWindow').parent(container);
  leftTop     = createDiv().id('leftTop').parent(leftWindow);
  createDiv().id('infoOverlay').parent(leftTop);

  leftBottom  = createDiv().id('leftBottom').parent(leftWindow);
  textZone    = createDiv().id('textZone').parent(leftBottom);
  actionPanel = createDiv().id('actionPanel').parent(leftBottom);
  rightWindow = createDiv().id('rightWindow').parent(container);
  updateElapsedTime();
  showTitle();
}

function showTitle() {
  showMessage('主人公は一般人ですが、無人島に遭難してしまいました。<br>なんとかして脱出を試みよう！');
  actionPanel.html('');
  rightWindow.html('');

  createButton('ニューゲーム').parent(actionPanel).mousePressed(startGame);
  createButton('README').parent(actionPanel).mousePressed(showReadme);

  if (localStorage.getItem('savedata')) {
    createButton('ロード').parent(actionPanel).mousePressed(loadAndRefresh);
  }
}

function startGame() {
  state = 'game';
  enemyKillCount = 0;
  battleTurnCount = 0;
  cooldownSearch = 0;
  cooldownGather = 0;
  updateParams();
  showMainActions();
}

function showReadme() {
  fetch('readme.md')
    .then(r => r.text())
    .then(text => {
      showMessage(text, true, showTitle);
    })
    .catch(() => {
      showMessage('READMEを読み込めませんでした。');
    });
}

function updateElapsedTime() {
  if (!showRecipes && !battle.active) {
    let layerStr = '';
    if (currentRoom !== null) {
      layerStr = `　研究所：${currentRoom}`;
    } else if (currentPlace === '森' || currentPlace === '洞窟') {
      layerStr = `　${currentPlace} ${placeLayers[currentPlace] + 1}層`;
    }
    updateBgImage(currentRoom ? '洞窟' : currentPlace);
    let overlay = select('#infoOverlay');
    if (overlay) overlay.html(`<span class="info-badge">経過時間: ${elapsedTime} 時間${layerStr}</span>`);
  }
}

function updateParams() {
  if (messageWaiting) return;
  rightWindow.html('');

  let hpColor = player.hp <= 20 ? 'tomato' : '#eee';
  let mpColor = player.mp <= 10 ? 'orange' : '#eee';
  let fuelStr = hasCampfire ? `<div class="param" style="color:${campfireFuel <= 2 ? 'orange' : '#eee'}">🔥 焚火燃料: ${campfireFuel}</div>` : '';
  createDiv(`
    <h2 style="margin:0 0 6px">ステータス</h2>
    <div class="param" style="color:${hpColor}">体力 (HP): ${player.hp} / ${MAX_HP}</div>
    <div class="param" style="color:${mpColor}">気力 (MP): ${player.mp} / ${MAX_MP}</div>
    ${fuelStr}
  `).parent(rightWindow);

  if (battle.active) {
    createDiv(`
      <h3 style="margin:8px 0 4px">敵：${battle.enemyName}</h3>
      <div class="param">敵HP: ${battle.enemyHp} / ${battle.enemyMaxHp}</div>
      <div class="param">距離: ${battle.distance}</div>
    `).parent(rightWindow);
  }

  createElement('h3', 'アイテム一覧').parent(rightWindow).style('margin', '10px 0 4px');
  let listDiv = createDiv().id('itemList').parent(rightWindow);
  if (Object.keys(itemCounts).length === 0) {
    listDiv.html('<i>アイテムがありません。</i>');
  } else {
    for (let name in itemCounts) {
      let div = createDiv(`${name} ×${itemCounts[name]}`).parent(listDiv);
      div.class('item-entry');
      if (selectedItem === name) div.addClass('selected');
      div.elt.addEventListener('click', (function(n) {
        return function() { selectedItem = n; updateParams(); };
      })(name));
    }
  }

  if (!battle.active) {
    let btnDiv = createDiv().id('itemButtons').parent(rightWindow);
    let btnUse = createButton('使用').parent(btnDiv);
    if (!selectedItem) btnUse.attribute('disabled', 'true');
    btnUse.mousePressed(() => { if (selectedItem) useItem(selectedItem); });

    let btnDesc = createButton('説明').parent(btnDiv);
    if (!selectedItem) btnDesc.attribute('disabled', 'true');
    btnDesc.mousePressed(() => { if (selectedItem) showItemDescription(selectedItem); });

    const healItems = ['りんご','小果実','うさぎ肉','狼の肉','干し肉','狼肉の燻製','薬草スープ','万能薬'];
    if (keiState === 'met' && !keiHealDone && selectedItem && healItems.includes(selectedItem)) {
      let btnGive = createButton('渡す').parent(btnDiv);
      btnGive.style('border-color', 'var(--accent-dim)');
      btnGive.style('color', 'var(--accent)');
      btnGive.mousePressed(() => giveItemToKei(selectedItem));
    }

    let btnDiscard = createButton('捨てる').parent(btnDiv);
    if (!selectedItem) btnDiscard.attribute('disabled', 'true');
    btnDiscard.mousePressed(() => {
      if (!selectedItem || !itemCounts[selectedItem]) return;
      let name = selectedItem;
      itemCounts[name]--;
      if (itemCounts[name] <= 0) { delete itemCounts[name]; selectedItem = null; }
      showMessage(`「${name}」を捨てました。`);
      updateParams();
    });
  }

  if (!battle.active) {
    let saveDiv = createDiv().id('saveButtons').parent(rightWindow);
    createButton('セーブ').parent(saveDiv).mousePressed(() => saveGame());
    let btnLoad = createButton('ロード').parent(saveDiv);
    if (!localStorage.getItem('savedata')) btnLoad.attribute('disabled', 'true');
    btnLoad.mousePressed(() => loadAndRefresh());
  }
}

function showMainActions() {
  if (messageWaiting) return;
  if (currentRoom !== null) { showLabActions(); return; }

  if (currentPlace === '広場' && keiState === 'plaza' && !keiPlazaArrived
      && maxLayers['森'] >= 3 && elapsedTime >= 150) {
    keiPlazaArrived = true;
    actionPanel.html('');
    showPortrait('kei');
    showMessage(
      '広場に戻ると、見覚えのある人物が焚火の近くに座っていた。<br>' +
      '新川ケイだ。足を引きずりながらも、なんとかたどり着いたらしい。',
      true,
      () => showMessage(
        'ケイ：来てくれると思ってました。<br>足、だいぶよくなりました。あなたのおかげです。',
        true,
        () => showMessage(
          'ケイ：この島のこと、一緒に調べませんか。',
          true,
          () => { hidePortrait(); updateParams(); showMainActions(); }
        )
      )
    );
    return;
  }

  actionPanel.html('');
  let layerStr = (currentPlace === '森' || currentPlace === '洞窟')
    ? `（${placeLayers[currentPlace] + 1}層）` : '';
  showMessage(`現在地：${currentPlace}${layerStr}　${placeDescriptions[currentPlace]}`);

  createButton('探索').parent(actionPanel).mousePressed(() => explore(currentPlace));
  createButton('移動').parent(actionPanel).mousePressed(() => showMoveOptions());
  if (currentPlace === '広場' && hasCampfire) {
    createButton('焚火で休憩').parent(actionPanel).mousePressed(() => {
      player.mp = constrain(player.mp + 10, 0, MAX_MP);
      player.hp = constrain(player.hp + 5,  0, MAX_HP);
      showMessage('焚火の周りで休憩した。気力と体力が回復した。');
      updateParams();
    });
    createButton('燃料を投入').parent(actionPanel).mousePressed(() => addFuelFromPanel());
  } else {
    createButton('待機').parent(actionPanel).mousePressed(() => waitAction());
  }
  if (hasRaft) {
    createButton('いかだ').parent(actionPanel).mousePressed(onRaftClick);
  }

  if (currentPlace === '広場' && keiState === 'plaza' && keiPlazaArrived) {
    let keiBtn = createButton('ケイと話す').parent(actionPanel);
    keiBtn.style('border-color', 'var(--accent-dim)');
    keiBtn.style('color', 'var(--accent)');
    keiBtn.mousePressed(() => talkToKeiPlaza());
  }

  let btnCraftMain = createButton('制作').parent(actionPanel);
  if (currentPlace !== '広場') btnCraftMain.attribute('disabled', 'true');
  btnCraftMain.mousePressed(() => {
    if (currentPlace !== '広場') { showMessage('制作は広場でのみ行えます。'); return; }
    selectedRecipe = null;
    renderRecipeList();
  });
}

function onRaftClick() {
  if (player.hp >= 80 && player.mp >= 30) {
    clearUI(); container.html('');
    createDiv().parent(container)
      .style('color','lime').style('font-size','48px')
      .style('text-align','center').style('padding-top','200px')
      .html('ゲームクリア！');
    createButton('タイトルに戻る').parent(container)
      .style('font-size','24px').style('margin-top','30px')
      .mousePressed(() => location.reload());
  } else {
    showMessage('救助が来る前に、力尽きてしまった。', true, () => showGameOver());
  }
}

function showGameOver() {
  state = 'gameover';
  battle.active = false;
  clearUI();
  container.html('');
  createDiv('GAME OVER')
    .parent(container)
    .style('font-size','48px');

  createButton('タイトルへ')
    .parent(container)
    .mousePressed(() => showTitle());
}

function clearUI() {
  leftWindow.remove();
  rightWindow.remove();
}

setup();
