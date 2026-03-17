// battle.js
// 戦闘関連ロジック

let battle = {
  active: false,
  enemyName: '',
  enemyHp: 0,
  enemyMaxHp: 0,
  enemyAtk: 0,
  enemyRange: 0,
  distance: 0,
  playerTurn: true,
  place: '',
};

function startBattle(place) {
  let layer = placeLayers[place] || 0;
  let candidates = Object.keys(enemyTypes).filter(n =>
    enemyTypes[n].places.includes(place) && enemyTypes[n].minLayer <= layer
  );
  let name = random(candidates);
  let e = enemyTypes[name];

  let hpBonus = layer * 2;
  let baseHp = floor(random(e.hp[0], e.hp[1] + 1));

  battle.active     = true;
  battle.enemyName  = name;
  battle.enemyHp    = baseHp + hpBonus;
  battle.enemyMaxHp = baseHp + hpBonus;
  battle.enemyAtk   = e.atk;
  battle.enemyRange = e.range;
  battle.distance   = floor(random(2, 6));
  battle.playerTurn = true;
  battle.place      = place;

  state = 'battle';
  battleTurnCount = 0;
  updateBattleInfo();
  updateParams();
  showMessage(`${name}が現れた！（${layer+1}層　HP:${battle.enemyHp}）　距離：${battle.distance}`);
  showBattleActions();
}

function updateBattleInfo() {
  let layer = placeLayers[battle.place] || 0;
  updateBgImage(battle.place);
  let overlay = select('#infoOverlay');
  if (overlay) {
    overlay.html(`
      <span class="info-badge" style="background:rgba(180,0,0,0.7)">⚔ 戦闘中 ／ ${battle.place} ${layer+1}層</span>
      <span class="info-badge">敵：${battle.enemyName}　HP: ${battle.enemyHp} / ${battle.enemyMaxHp}</span>
      <span class="info-badge">距離：${battle.distance}　${battle.playerTurn ? '【あなたのターン】' : '【敵のターン】'}</span>
    `);
  }
}

function showBattleActions() {
  actionPanel.html('');

  let btnFwd = createButton('前進').parent(actionPanel);
  if (battle.distance <= 1) btnFwd.attribute('disabled', 'true');
  btnFwd.mousePressed(() => playerBattleAction('forward'));

  if (battle.distance >= 6) {
    createButton('逃走').parent(actionPanel)
      .mousePressed(() => playerBattleAction('escape'));
  } else {
    createButton('後退').parent(actionPanel)
      .mousePressed(() => playerBattleAction('backward'));
  }

  createButton('待機').parent(actionPanel).mousePressed(() => playerBattleAction('wait'));

  if (battle.distance <= 1) {
    createButton('素手（射程1, 攻撃力1）').parent(actionPanel)
      .mousePressed(() => playerBattleAction('attack', '素手', 1));
  }

  for (let wName in weapons) {
    if ((itemCounts[wName] || 0) > 0) {
      let w = weapons[wName];
      let [rMin, rMax] = w.range;
      if (battle.distance >= rMin && battle.distance <= rMax) {
        let rangeLabel = rMin === rMax ? `${rMin}` : `${rMin}〜${rMax}`;
        createButton(`${wName}（射程${rangeLabel}, 攻撃力${w.atk}）`).parent(actionPanel)
          .mousePressed(() => playerBattleAction('attack', wName, w.atk));
      }
    }
  }
}

function playerBattleAction(type, weaponName, atk) {
  if (!battle.playerTurn) return;

  battleTurnCount++;

  player.mp = constrain(player.mp - 1, 0, MAX_MP);
  if (player.mp <= 0 && Math.random() < 0.3) {
    showMessage('疲れてうまく動けない！');
    updateParams();
    return;
  }

  let msg = '';

  if (type === 'forward') {
    battle.distance--;
    msg = `前進した。距離：${battle.distance}`;
  } else if (type === 'backward') {
    battle.distance++;
    msg = `後退した。距離：${battle.distance}`;
  } else if (type === 'escape') {
    battle.active = false;
    state = 'game';
    let escPlace = battle.place;
    if (escPlace === '森' || escPlace === '洞窟') {
      placeLayers[escPlace] = max(0, maxLayers[escPlace] - 1);
    }
    let escLayer = placeLayers[escPlace] || 0;
    showMessage(
      `逃走した！<br>追われながら引き返した。現在 ${escPlace} ${escLayer + 1}層。`,
      true,
      () => { updateElapsedTime(); updateParams(); showMainActions(); }
    );
    updateParams();
    return;
  } else if (type === 'wait') {
    msg = '待機した。';
  } else if (type === 'attack') {
    let dmg = atk + floor(random(0, 2));
    battle.enemyHp -= dmg;
    msg = `${weaponName}で攻撃！${battle.enemyName}に ${dmg} ダメージ。`;
    if (battle.enemyHp <= 0) {
      battle.enemyHp = 0;
      updateBattleInfo();
      updateParams();
      showMessage(msg, true, () => endBattle(true));
      return;
    }
  }

  let { msg: enemyMsg, isDead } = calcEnemyAction();

  battle.playerTurn = true;
  updateBattleInfo();
  updateParams();

  let combined = msg + '<br><span style="color:#f88">▶ ' + enemyMsg + '</span>';

  if (isDead) {
    battle.active = false;
    state = 'gameover';
    showMessage(combined + '<br><span style="color:tomato">体力が尽きた……</span>', true, () => showGameOver());
    return;
  }

  showMessage(combined);
  showBattleActions();
}

function calcEnemyAction() {
  let msg = '';
  if (battle.distance <= battle.enemyRange) {
    let dmg = battle.enemyAtk + floor(random(0, 2));
    player.hp -= dmg;
    player.hp = max(0, player.hp);
    msg = `${battle.enemyName}の攻撃！${dmg} ダメージを受けた。`;
  } else {
    if (random() < 0.7) {
      battle.distance--;
      msg = `${battle.enemyName}が前進した。距離：${battle.distance}`;
    } else {
      msg = `${battle.enemyName}は様子を見ている。`;
    }
  }
  return { msg, isDead: player.hp <= 0 };
}

function endBattle(victory) {
  if (!victory) return;

  if (battle.isNaoto) {
    battle.active = false;
    battle.isNaoto = false;
    state = 'game';
    labNaotoDead = true;
    addItem('カギのかけら');
    showMessage(
      '<span style="color:#ffd700;font-size:18px;font-weight:bold">林ナオト（変異体）を倒した。</span>',
      true,
      () => showMessage(
        '変異体は崩れ落ちた。<br>' +
        'その手から、壊れた鍵のかけらが落ちた。<br><br>' +
        '<span style="color:#adf">（カギのかけらを手に入れた）</span>',
        true,
        () => { advanceTime(battleTurnCount / 4); updateParams(); showMainActions(); }
      )
    );
    updateParams();
    return;
  }

  let e = enemyTypes[battle.enemyName];
  let place = battle.place;
  let layer = placeLayers[place] || 0;

  let dropBonus = floor(layer / 2);
  let drops = [];
  for (let d of e.drops) {
    let times = 1 + dropBonus;
    for (let i = 0; i < times; i++) {
      if (random() < d.chance) {
        addItem(d.item);
        drops.push(d.item);
      }
    }
  }

  enemyKillCount++;
  if (enemyKillCount % 2 === 0) {
    placeLayers[place] = layer + 1;
    maxLayers[place] = max(maxLayers[place], placeLayers[place]);
    resetCooldown();
  }

  let dropMsg = drops.length > 0 ? `ドロップ：${drops.join('、')}` : 'ドロップなし';
  let nextLayer = placeLayers[place] + 1;

  battle.active = false;
  state = 'game';

  showMessage(
    `<span style="color:#ffd700;font-size:18px;font-weight:bold">⚔ ${battle.enemyName}を倒した！</span>`,
    true,
    () => {
      let dropListHtml = drops.length > 0
        ? drops.map(d => `<div class="drop-item">✦ ${d}</div>`).join('')
        : '<div style="color:#aaa">ドロップなし</div>';
      showMessage(
        `<div style="margin-bottom:6px"><b>ドロップアイテム</b></div>` +
        dropListHtml +
        `<div style="margin-top:8px;color:#aaa;font-size:13px">${place} → ${nextLayer}層へ進む</div>`,
        true,
        () => {
          advanceTime(battleTurnCount / 4);
          updateParams();
          showMainActions();
        }
      );
    }
  );
  updateParams();
}

function startBattleNaoto() {
  battle.active     = true;
  battle.enemyName  = '林ナオト（変異体）';
  battle.isNaoto    = true;
  battle.enemyHp    = 30;
  battle.enemyMaxHp = 30;
  battle.enemyAtk   = 8;
  battle.enemyRange = 2;
  battle.distance   = 3;
  battle.playerTurn = true;
  battle.place      = '廊下';
  state = 'battle';
  updateBattleInfo();
  updateParams();
  showMessage('林ナオト（変異体）が現れた！　距離：3', false);
  showBattleActions();
}
