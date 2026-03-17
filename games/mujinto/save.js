// save.js
// セーブ・ロード関連

function saveGame() {
  if (battle.active) { showMessage('戦闘中はセーブできません。'); return; }
  try {
    const data = {
      player:              JSON.parse(JSON.stringify(player)),
      elapsedTime,
      exploreCounts:       JSON.parse(JSON.stringify(exploreCounts)),
      exploreCooldown:     JSON.parse(JSON.stringify(exploreCooldown)),
      currentPlace,
      placeLayers:         JSON.parse(JSON.stringify(placeLayers)),
      maxLayers:           JSON.parse(JSON.stringify(maxLayers)),
      itemCounts:          JSON.parse(JSON.stringify(itemCounts)),
      hasCampfire, campfireFuel, hasRaft,
      keiState, keiTalkCount, forest8EventDone, keiHealDone, keiPlazaArrived,
      forest3EventDone,
      labUnlocked, labHasKey, labGunTaken, labNaotoMet, labNaotoDead,
      labGlueMaterialTaken, currentRoom,
      keiLabTalkCounts: JSON.parse(JSON.stringify(keiLabTalkCounts)),
    };
    localStorage.setItem('savedata', JSON.stringify(data));
    showMessage('セーブしました。（経過時間：' + elapsedTime + '時間）');
    updateParams();
  } catch(e) {
    showMessage('セーブに失敗しました：' + e.message);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem('savedata');
    if (!raw) { showMessage('セーブデータがありません。'); return false; }
    const d = JSON.parse(raw);
    player.hp    = d.player.hp;
    player.mp    = d.player.mp;
    elapsedTime  = d.elapsedTime;
    Object.assign(exploreCounts,   d.exploreCounts   || {});
    Object.assign(exploreCooldown, d.exploreCooldown || {});
    currentPlace = d.currentPlace;
    Object.assign(placeLayers, d.placeLayers || {});
    Object.assign(maxLayers,   d.maxLayers   || {});
    for (let k in itemCounts) delete itemCounts[k];
    Object.assign(itemCounts, d.itemCounts || {});
    hasCampfire          = !!d.hasCampfire;
    campfireFuel         = d.campfireFuel   || 0;
    hasRaft              = !!d.hasRaft;
    selectedItem         = null;
    keiState             = d.keiState             || 'unknown';
    keiTalkCount         = d.keiTalkCount         || 0;
    forest8EventDone     = !!d.forest8EventDone;
    keiHealDone          = !!d.keiHealDone;
    keiPlazaArrived      = !!d.keiPlazaArrived;
    forest3EventDone     = !!d.forest3EventDone;
    labUnlocked          = !!d.labUnlocked;
    labHasKey            = !!d.labHasKey;
    labGunTaken          = !!d.labGunTaken;
    labNaotoMet          = !!d.labNaotoMet;
    labNaotoDead         = !!d.labNaotoDead;
    labGlueMaterialTaken = !!d.labGlueMaterialTaken;
    currentRoom          = d.currentRoom || null;
    if (d.keiLabTalkCounts) Object.assign(keiLabTalkCounts, d.keiLabTalkCounts);
    return true;
  } catch(e) {
    showMessage('ロードに失敗しました：' + e.message);
    return false;
  }
}

function loadAndRefresh() {
  if (loadGame()) {
    state = 'game';
    updateBgImage(currentRoom ? '洞窟' : currentPlace);
    updateElapsedTime();
    updateParams();
    showMainActions();
  }
}
