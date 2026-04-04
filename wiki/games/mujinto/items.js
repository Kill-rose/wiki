// items.js
// アイテム関連の処理

function showItemDescription(itemName) {
  let item = itemData[itemName] || { flavor: itemName };
  let text = item.flavor || itemName;
  if (item.type === 'heal' && item.heal !== undefined) {
    text += `\n回復量：${item.heal}`;
  }
  if (item.type === 'weapon' && item.atk !== undefined) {
    text += `\n攻撃：${item.atk}`;
  }
  showMessage(text, true, () => updateParams());
}

function unlockRecipe(recipe) {
  if (!recipe || !recipe.id) return;
  if (!recipes[recipe.id]) {
    recipes[recipe.id] = recipe;
  }
}

function addItem(name, count = 1) {
  itemCounts[name] = (itemCounts[name] || 0) + count;

  if (name === 'カギのかけら') {
    unlockRecipe({
      id: '研究室の鍵',
      req: { 'カギのかけら': 1, '接着剤': 1 },
      time: 1,
      flavor: '壊れた鍵の破片を接着剤で繋げて復元する。',
      type: 'material',
    });
  }
}

function useItem(name) {
  if (!name || !itemCounts[name]) return;

  const foodTable = {
    'りんご':       { hp: 0,       mp: 10 },
    '小果実':       { hp: 0,       mp: 10 },
    'うさぎ肉':     { hp: 0,       mp: 15 },
    '狼の肉':       { hp: 0,       mp: 20 },
    '干し肉':       { hp: 15,      mp: 10 },
    '狼肉の燻製':   { hp: 20,      mp: 20 },
    '薬草スープ':   { hp: 20,      mp: 0  },
    '万能薬':       { hp: MAX_HP,  mp: 0  },
  };

  if (name in foodTable) {
    let f = foodTable[name];
    let hpGain = f.hp === MAX_HP ? (MAX_HP - player.hp) : f.hp;
    player.hp = constrain(player.hp + f.hp, 0, MAX_HP);
    player.mp = constrain(player.mp + f.mp, 0, MAX_MP);
    itemCounts[name]--;
    if (itemCounts[name] <= 0) { delete itemCounts[name]; selectedItem = null; }
    let msg = `「${name}」を使った。`;
    if (f.hp === MAX_HP) msg += ` HPが全回復した！`;
    else {
      if (f.hp > 0) msg += ` HP+${f.hp}。`;
      if (f.mp > 0) msg += ` 気力+${f.mp}。`;
    }
    showMessage(msg);
    updateParams();
    return;
  }

  if (name === 'トランシーバー') {
    showMessage(
      'トランシーバーを使って助けを呼んだ。<br>' +
      '「こちら救助隊です。位置を確認しました。今すぐ向かいます！」<br>' +
      '……しばらくして、ヘリコプターの音が聞こえてきた。無事に救助された！',
      true,
      () => {
        clearUI();
        container.html('');
        createDiv().parent(container)
          .style('color','lime').style('font-size','40px')
          .style('text-align','center').style('padding-top','160px')
          .html('救助成功！<br><span style="font-size:24px">トランシーバーで助けを呼び、無事に帰還した。</span>');
        createButton('タイトルに戻る').parent(container)
          .style('font-size','22px').style('margin-top','30px')
          .mousePressed(() => location.reload());
      }
    );
    return;
  }

  if (name === '木の枝' || name === '木材') {
    if (!hasCampfire && campfireFuel <= 0) {
      showMessage('焚火がありません。まず焚火を設置してください。');
      return;
    }
    let fuel = name === '木の枝' ? 1 : 3;
    campfireFuel += fuel;
    if (!hasCampfire) hasCampfire = true;
    itemCounts[name]--;
    if (itemCounts[name] <= 0) { delete itemCounts[name]; selectedItem = null; }
    showMessage(`「${name}」を焚火に投入した。残燃料：${campfireFuel}`);
    updateParams();
    return;
  }

  if (name === '焚火') {
    if (currentPlace === '広場') {
      hasCampfire = true;
      campfireFuel = 5;
      itemCounts[name]--;
      if (itemCounts[name] <= 0) { delete itemCounts[name]; selectedItem = null; }
      showMessage(`広場に焚火を設置した。初期燃料：${campfireFuel}`);
      updateParams(); showMainActions();
    } else { showMessage('焚火は広場でしか設置できません。'); }
    return;
  }

  if (name === 'いかだ') {
    if (currentPlace === '広場') {
      hasRaft = true;
      itemCounts[name]--;
      if (itemCounts[name] <= 0) { delete itemCounts[name]; selectedItem = null; }
      showMessage('広場にいかだを設置した。');
      updateParams(); showMainActions();
    } else { showMessage('いかだは広場でしか設置できません。'); }
    return;
  }

  if (name === '研究所の記録') {
    showMessage(
      '「研究所の記録」を手に入れた。<br>' +
      'この記録があれば、プロジェクトTIDALの真実を世に出せる。<br>' +
      '<span style="color:#adf">（謎解きルートクリア条件を満たした。いかだか、トランシーバーで脱出しよう）</span>'
    );
    return;
  }

  showMessage(`「${name}」はここでは使えません。`);
}

function giveItemToKei(itemName) {
  if (!itemName || !itemCounts[itemName]) return;
  itemCounts[itemName]--;
  if (itemCounts[itemName] <= 0) { delete itemCounts[itemName]; selectedItem = null; }
  keiHealDone = true;
  keiState = 'plaza';

  showPortrait('kei');
  showMessage(
    `「${itemName}」を差し出すと、ケイは両手で受け取り、すぐに口に入れた。<br>` +
    'しばらくして、顔に少し血色が戻ってきた。',
    true,
    () => showMessage(
      'ケイ：……ありがとうございます。<br>' +
      '広場――。わかりました。<br>' +
      'そこで待ってます。',
      true,
      () => {
        hidePortrait();
        showMessage(
          '彼はゆっくりと立ち上がり、木に寄りかかりながら歩き始めた。<br>' +
          '<span style="color:var(--accent)">（ケイが広場に向かった）</span>',
          false, null
        );
        updateParams();
        showMainActions();
      }
    )
  );
}

function addFuelFromPanel() {
  actionPanel.html('');
  showMessage('投入する燃料を選んでください。（木の枝：+1、木材：+3）');

  let fuelItems = ['木の枝', '木材'].filter(n => (itemCounts[n] || 0) > 0);
  if (fuelItems.length === 0) {
    showMessage('投入できる燃料がありません。木の枝か木材が必要です。');
    showMainActions();
    return;
  }
  fuelItems.forEach(item => {
    let gain = item === '木の枝' ? 1 : 3;
    createButton(`${item}（+${gain}）×${itemCounts[item]}`).parent(actionPanel)
      .mousePressed(() => {
        itemCounts[item]--;
        if (itemCounts[item] <= 0) delete itemCounts[item];
        campfireFuel += gain;
        if (!hasCampfire) hasCampfire = true;
        showMessage(`${item}を焚火に投入した。残燃料：${campfireFuel}`);
        updateParams();
        showMainActions();
      });
  });
  createButton('戻る').parent(actionPanel)
    .mousePressed(() => showMainActions());
}
