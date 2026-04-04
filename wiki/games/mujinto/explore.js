// explore.js
// 探索・移動・研究所関連の処理

function getRandomItem(place, layer = 0) {
  let pool;
  if (place === '広場') {
    pool = ['木の枝', '木の枝', '小果実', '草', '草', '石'];
  } else if (place === '森') {
    pool = ['木材', '木の枝', '草', 'りんご'];
    if (layer >= 3) pool.push('大きな木材', '薬草', '薬草');
    if (layer >= 6) pool.push('特別な木材', '貴重な薬草');
  } else {
    pool = ['石', '石', '木材'];
    if (layer >= 3) pool.push('鉄鉱石', '鉄鉱石', '宝石');
    if (layer >= 6) pool.push('純鉄', '純鉄');
  }
  return random(pool);
}

function showMoveOptions() {
  if (messageWaiting) return;
  actionPanel.html('');
  showMessage('移動先を選んでください。');

  let places = ['広場', '森', '洞窟'];
  places.forEach(place => {
    if (place === currentPlace && currentRoom === null) return;
    createButton(place).parent(actionPanel).mousePressed(() => moveTo(place));
  });

  if (labUnlocked) {
    let rooms = ['廊下', '研究室', '実験室', '倉庫'];
    rooms.forEach(room => {
      if (currentRoom === room) return;
      let btn = createButton(`研究所：${room}`).parent(actionPanel);
      if (room === '研究室' && !labHasKey) btn.attribute('disabled', 'true');
      btn.mousePressed(() => moveToLab(room));
    });
    if (currentRoom !== null) {
      createButton('洞窟（6層）').parent(actionPanel).mousePressed(() => {
        currentRoom = null;
        moveTo('洞窟');
      });
    }
  }

  createButton('戻る').parent(actionPanel)
    .style('background-color', 'var(--bg-raised)')
    .mousePressed(() => showMainActions());
}

function moveTo(place) {
  currentRoom = null;
  if ((currentPlace === '森' || currentPlace === '洞窟') && place !== currentPlace) {
    let prev = placeLayers[currentPlace];
    placeLayers[currentPlace] = max(0, prev - 1);
    if (prev > 0) {
      showMessage(`${currentPlace}から帰った。次回は ${placeLayers[currentPlace] + 1}層からになる。`);
    }
  }
  currentPlace = place;
  exploreCooldown[place] = 0;
  exploreCounts[place] = 0;
  passTime(1);
  showMainActions();
}

function explore(place) {
  if (exploreCooldown[place] > 0) {
    showMessage(`ここからはもう何も見つからなさそうだ。<br>時間を置いてみよう。`);
    return;
  }

  exploreCounts[place]++;
  passTime(1);

  player.mp = constrain(player.mp - 1, 0, MAX_MP);
  updateParams();

  if (exploreCounts[place] >= EXPLORE_LIMIT) {
    exploreCooldown[place] = 5;
    exploreCounts[place] = 0;
  }

  let layer = (place === '森' || place === '洞窟') ? placeLayers[place] : 0;

  if (place === '森' && layer >= 7 && !forest8EventDone) {
    forest8EventDone = true;
    keiState = 'met';
    showPortrait('kei');
    showMessage(
      '深い森の奥、木の根元に人が倒れているのが見えた。<br>' +
      '駆け寄ると、若い男だった。足に深い傷を負っている。<br>' +
      'ゆっくりと目を開け、こちらを見た。',
      true,
      () => showMessage(
        'ケイ：人間……？本当に人間ですか。<br>' +
        'よかった。もう10日も……動けなくて。',
        true,
        () => showMessage(
          'ケイ：あなたも、あの船から？<br>' +
          '僕は新川ケイ。港で林って人に声をかけられて……この航路を勧められたんです。',
          true,
          () => {
            hidePortrait();
            showMessage(
              '彼は足の傷がひどく、今すぐ動くことはできないようだった。<br>' +
              '何か回復するものを渡せれば、合流できるかもしれない。<br>' +
              '<span style="color:var(--accent)">（アイテム一覧から回復系アイテムを選んで「渡す」ボタンを押そう）</span>',
              false, null
            );
            updateParams();
            showMainActions();
          }
        )
      )
    );
    return;
  }

  if (place === '森' && layer >= 2 && !forest3EventDone) {
    forest3EventDone = true;
    keiState = 'forest_reachable';
    showMessage(
      '草木を切り開いて奥へ進んだ。<br>' +
      '……道が開けた。この先に何かあるかもしれない。<br>' +
      '<span style="color:#adf">（森の奥に進めるようになった）</span>'
    );
    updateParams();
    return;
  }

  if (place === '洞窟' && layer >= 5 && !labUnlocked) {
    if (elapsedTime >= 100) {
      labUnlocked = true;
      showMessage(
        '深部を進むと、崩落した壁の向こうに金属製の扉が見えた。<br>' +
        '……研究所への入口だ。<br>' +
        '<span style="color:#adf">（移動先に「研究所：廊下」が追加された）</span>',
        true, () => { updateElapsedTime(); updateParams(); showMainActions(); }
      );
    } else {
      showMessage('深部まで来たが、崩落した瓦礫が道を塞いでいる。まだ進めそうにない。');
      updateParams();
    }
    return;
  }

  let rand = random();

  if (place === '広場') {
    if (rand < 0.85) {
      let item = getRandomItem(place, layer);
      addItem(item);
      showMessage(`${place}を探索して「${item}」を入手した。`);
    } else {
      showMessage(`${place}を探索したが、何も見つからなかった。`);
    }
    updateParams();
  } else {
    if (rand < 0.10) {
      startBattle(place);
    } else if (rand < 0.90) {
      let itemCount = 1 + floor(layer / 3);
      let msgs = [];
      for (let i = 0; i < itemCount; i++) {
        let item = getRandomItem(place, layer);
        addItem(item);
        msgs.push(item);
      }
      showMessage(`${place}（${layer+1}層）を探索して「${msgs.join('、')}」を入手した。`);
      updateParams();
    } else {
      showMessage(`${place}を探索したが、何も見つからなかった。`);
      updateParams();
    }
  }
}

function waitAction() {
  if (currentRoom !== null) {
    if (random() < 0.02) {
      showMessage('物音がした……');
      passTime(1);
      startBattle('洞窟');
    } else {
      showMessage('待機した。');
      passTime(1);
      showLabActions();
    }
    return;
  }
  if (currentPlace === '広場' && hasCampfire) {
    player.mp = constrain(player.mp + 10, 0, MAX_MP);
    player.hp = constrain(player.hp + 5,  0, MAX_HP);
    showMessage('焚火で休憩した。気力と体力が回復した。');
    passTime(1);
    showMainActions();
  } else if (currentPlace === '森' || currentPlace === '洞窟') {
    let layer = placeLayers[currentPlace] || 0;
    let encounterChance = 0.05 + layer * 0.01;
    if (random() < encounterChance) {
      showMessage(`待機中に気配を感じた……`);
      passTime(1);
      startBattle(currentPlace);
    } else {
      showMessage('待機した。');
      passTime(1);
      showMainActions();
    }
  } else {
    showMessage('待機した。');
    passTime(1);
    showMainActions();
  }
}

function passTime(hours) {
  elapsedTime += hours;
  updateElapsedTime();
  for (let p in exploreCooldown) {
    exploreCooldown[p] = max(0, exploreCooldown[p] - hours);
  }
  if (hasCampfire) {
    campfireFuel -= hours;
    if (campfireFuel <= 0) {
      campfireFuel = 0;
      hasCampfire = false;
      let cur = textZone.html();
      showMessage(cur + '<br><span style="color:orange">⚠ 焚火の燃料が尽きた。</span>');
    }
  }
  if (player.mp <= 0) {
    player.hp -= 5 * hours;
    showMessage(textZone.html() + '<br><span style="color:tomato">気力が0なので体力が減少した。</span>');
  } else if (player.mp >= 40) {
    player.hp += 2 * hours;
  }
  player.hp = constrain(player.hp, 0, MAX_HP);
  player.mp = constrain(player.mp, 0, MAX_MP);
  updateParams();
  if (player.hp <= 0) {
    showMessage('体力が尽きた。ゲームオーバー。', true, () => showGameOver());
  }
}

function advanceTime(hours) {
  elapsedTime += hours;
  updateElapsedTime();
}

function resetCooldown() {
  for (let p in exploreCooldown) exploreCooldown[p] = 0;
  cooldownSearch = 0;
  cooldownGather = 0;
}

function moveToLab(room) {
  if (room === '研究室' && !labHasKey && !(itemCounts['研究室の鍵'] > 0)) {
    showMessage('研究室は鍵がかかっている。どこかに鍵があるはずだ。');
    return;
  }
  if (room === '研究室' && !labHasKey && itemCounts['研究室の鍵'] > 0) {
    labHasKey = true;
    itemCounts['研究室の鍵']--;
    if (itemCounts['研究室の鍵'] <= 0) delete itemCounts['研究室の鍵'];
    showMessage('研究室の鍵で扉を開けた。');
  }
  currentRoom = room;
  exploreCooldown[room] = exploreCooldown[room] || 0;
  exploreCounts[room]   = exploreCounts[room]   || 0;
  exploreCooldown[room] = 0;
  exploreCounts[room]   = 0;
  passTime(1);

  if (room === '廊下') {
    updateBgImage('洞窟');
    if (!labNaotoMet && elapsedTime < 150) {
      labNaotoMet = true;
      showPortrait('naoto');
      showMessage(
        '廊下の奥から、ゆっくりと足音が近づいてきた。<br>' +
        '痩せ細った男が壁に寄りかかって立っていた。',
        true,
        () => showMessage(
          '林ナオト：……来たのか。ここまで来るとは思わなかった。<br>' +
          '私は林ナオト。この研究所を作った人間だ。',
          true,
          () => showMessage(
            '林ナオト：妹のユキが海で死んだ。だから作った。海で死なない人間を。<br>' +
            '間違っていた。彼らを人として扱わなかった。',
            true,
            () => showMessage(
              '林ナオト：あなたの船を沈めたのも、私だ。サンプルが漏れると思って……<br>' +
              '全部、私のせいだ。',
              true,
              () => showMessage(
                '林ナオト：これを持っていけ。記録が残っている。全部読んでくれ。<br><br>' +
                'ナオトは壁に背を預け、静かに目を閉じた。<br>' +
                'その手から、壊れた鍵のかけらが床に落ちた。<br>' +
                '……もう、動かなかった。',
                true,
                () => {
                  hidePortrait();
                  labNaotoDead = true;
                  addItem('カギのかけら');
                  showMessage(
                    '<span style="color:var(--accent)">（カギのかけらを入手した）</span>',
                    false, null
                  );
                  updateParams();
                  showMainActions();
                }
              )
            )
          )
        )
      );
      return;
    } else if (!labNaotoMet && elapsedTime >= 150) {
      labNaotoMet = true;
      showPortrait('naoto');
      showMessage(
        '廊下の奥で何かが動く気配がした。<br>' +
        '振り返ると——人だったものが、こちらを向いていた。<br>' +
        'かつては林ナオトだったその姿は、すでに人の形をほとんどとどめていなかった。',
        true,
        () => { hidePortrait(); startBattleNaoto(); }
      );
      return;
    } else if (labNaotoMet && !labNaotoDead) {
      showMessage(
        '廊下に変異体がまだいる。<br>',
        true,
        () => startBattleNaoto()
      );
      return;
    }
  }

  updateBgImage('洞窟');
  updateElapsedTime();
  updateParams();
  showMainActions();
}

function showLabActions() {
  if (messageWaiting) return;
  actionPanel.html('');
  let desc = labRoomDescriptions[currentRoom] || '';
  showMessage(`【研究所：${currentRoom}】　${desc}`);

  createButton('探索').parent(actionPanel).mousePressed(() => explorelab(currentRoom));
  createButton('移動').parent(actionPanel).mousePressed(() => showMoveOptions());
  createButton('待機').parent(actionPanel).mousePressed(() => waitAction());

  if (labDocuments[currentRoom]) {
    createButton('資料').parent(actionPanel).mousePressed(() => {
      showMessage(labDocuments[currentRoom], true, () => showLabActions());
    });
  }

  if (currentRoom === '研究室') {
    createButton('PCを操作').parent(actionPanel).mousePressed(() => showPasswordInput());
  }

  if (keiState === 'plaza' && keiLabTalkCounts[currentRoom] < keiLabDialogs[currentRoom].length) {
    let btn = createButton('会話：ケイ').parent(actionPanel);
    btn.style('background-color', 'var(--bg-raised)');
    btn.style('border-color', 'var(--accent-dim)');
    btn.style('color', 'var(--accent)');
    btn.mousePressed(() => {
      let idx = keiLabTalkCounts[currentRoom];
      keiLabTalkCounts[currentRoom]++;
      showMessage(keiLabDialogs[currentRoom][idx], true, () => showLabActions());
    });
  }
}

function explorelab(room) {
  if ((exploreCooldown[room] || 0) > 0) {
    showMessage(`${room}はクールダウン中。しばらく待ってください。`);
    return;
  }

  exploreCounts[room] = (exploreCounts[room] || 0) + 1;
  passTime(1);
  player.mp = constrain(player.mp - 1, 0, MAX_MP);
  updateParams();

  if ((exploreCounts[room] || 0) >= EXPLORE_LIMIT) {
    exploreCooldown[room] = 5;
    exploreCounts[room]   = 0;
  }

  if (room === '実験室' && !labGlueMaterialTaken) {
    labGlueMaterialTaken = true;
    addItem('接着剤のもと');
    unlockRecipe({
      id: '接着剤',
      req: { '蛇の皮': 1, '接着剤のもと': 1 },
      time: 1,
      flavor: '材料を混ぜ合わせて作る接着剤。',
      type: 'material',
    });
    showMessage(
      '実験室の棚に見慣れない容器を見つけた。ラベルには「有機接着剤原料」とある。<br>' +
      '<span style="color:#adf">（「接着剤のもと」を入手した）</span><br>' +
      '<span style="color:#adf">（接着剤のレシピを覚えた：蛇の皮＋接着剤のもと）</span>'
    );
    updateParams();
    return;
  }

  let rand = random();
  if (rand < 0.05) {
    startBattle('洞窟');
    return;
  }

  if (room === '倉庫' && !labGunTaken && rand < 0.50) {
    labGunTaken = true;
    addItem('フレアガン');
    showMessage('棚の裏に古びたケースを発見した。中に<b>フレアガン</b>が入っていた！<br>射程3〜5、攻撃力4。');
    updateParams();
    return;
  }

  let item = getLabItem(room);
  if (item) {
    addItem(item);
    showMessage(`【${room}】を探索して「${item}」を入手した。`);
  } else {
    showMessage(`【${room}】を探索したが、何も見つからなかった。`);
  }
  updateParams();
}

function showPasswordInput() {
  actionPanel.html('');
  showMessage('端末にパスワードを入力してください。（6桁の数字）');

  let input = createElement('input');
  input.attribute('type', 'text');
  input.attribute('maxlength', '6');
  input.attribute('placeholder', '000000');
  input.style('font-size', '18px');
  input.style('padding', '6px 10px');
  input.style('background', 'var(--bg-deep)');
  input.style('color', 'var(--text-primary)');
  input.style('border', '1px solid var(--border)');
  input.style('border-radius', '2px');
  input.style('width', '120px');
  input.style('text-align', 'center');
  input.parent(actionPanel);

  createButton('入力').parent(actionPanel).mousePressed(() => {
    let val = input.value().trim();
    checkPassword(val);
  });
  createButton('戻る').parent(actionPanel)
    .style('background-color', 'var(--bg-raised)')
    .mousePressed(() => showLabActions());
}

function checkPassword(val) {
  if (val === '200431') {
    showMessage(
      '<b>【端末：アクセス許可】</b><br><br>' +
      'プロジェクトTIDALの真の目的：<br>' +
      '極限環境下での生存能力を持つ人間の量産。<br>' +
      '発注元：——省　極秘予算より拠出。<br><br>' +
      '被験者は全員、ある共通点を持つ人間から選ばれた。<br>' +
      '家族がいない。誰にも探されない。<br><br>' +
      '私は自分でも被験者になった。（No.7、自己投与　2013年8月）<br>' +
      '彼らをもっと理解したかった。<br><br>' +
      'この記録を外に持ち出してほしい。<br>' +
      '——製薬はもうない。でも発注した側はまだいる。<br>' +
      'これが証拠になる。<br><br>' +
      'ユキ、ごめん。',
      true,
      () => {
        addItem('研究所の記録');
        showMessage('<span style="color:#adf">（「研究所の記録」を入手した。これが謎解きルートのクリアアイテムだ）</span>', true, () => showLabActions());
      }
    );
  } else {
    showMessage('パスワードが違う。', true, () => showPasswordInput());
  }
}
