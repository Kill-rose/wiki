// ===== ゲーム状態管理(オンライン同期用の基盤) =====
const gameState = {
    players: [
        { id: '2P', hp: 5, shield: 3, mana: 10, maxMana: 10, deck: [], hand: [], field: { battle: [null, null, null], reserve: [null, null, null], counter: null }, graveyard: [], ex: [] },
        { id: '1P', hp: 5, shield: 3, mana: 10, maxMana: 10, deck: [], hand: [], field: { battle: [null, null, null], reserve: [null, null, null], counter: null }, graveyard: [], ex: [], free: [] }
    ],
    turn: 1,
    currentPlayer: 1,
    isFirstPlayerFirstTurn: true,
    logs: [{ type: 'system', message: '対戦を開始しました', time: Date.now() }],
    privateLogs: [], // 自分専用ログ
    selectedCard: null,
    selectedCardSource: null,
    handZoneMode: 'hand',
    mulliganPhase: true,
    mulliganSelected: [],
    selectedFieldCell: null,
    selectedFieldPosition: null,
    usedSupporterThisTurn: false,
    selectedFieldMonster: null
};

// 日本語変換マップ
const translations = {
    cardBase: {
        'monster': 'モンスター',
        'ex': 'EXモンスター',
        'magic': '魔法',
        'supporter': 'サポーター'
    },
    attribute: {
        'ti': '地',
        'hi': '火',
        'mizu': '水',
        'kaze': '風',
        'yami': '闇',
        'hikari': '光'
    },
    monsterType: {
        '通常': '通常',
        '進化': '進化',
        '特殊進化': '特殊進化',
        'EX': 'EX'
    }
};

// 独立した場出しパネルの制御
let placementPanelCardIndex = null;

// 独立パネルを表示
function showPlacementPanel(cardIndex, card, isMoveMode = false) {
    placementPanelCardIndex = cardIndex;
    const panel = document.getElementById('placementPanel');
    const confirmBtn = document.getElementById('placementConfirmBtn');
    const title = document.querySelector('.placement-title');
    
    if (isMoveMode) {
        title.textContent = '移動先を選択';
    } else {
        title.textContent = '場に出す位置を選択';
    }
    
    panel.classList.add('active');
    confirmBtn.disabled = true;
    
    document.querySelectorAll('.placement-cell').forEach(cell => {
        const zone = cell.dataset.zone;
        const index = parseInt(cell.dataset.index);
        const monster = gameState.players[1].field[zone][index];
        
        cell.classList.remove('selected', 'disabled');
        
        if (isMoveMode) {
            // 移動モード:すべてのセルが有効
        } else {
            if (card.monsterType === '通常') {
                if (monster !== null) {
                    cell.classList.add('disabled');
                }
            } else if (card.monsterType === '特殊進化') {
                if (monster === null) {
                    cell.classList.add('disabled');
                }
            }
        }
    });
}

function hidePlacementPanel() {
    document.getElementById('placementPanel').classList.remove('active');
    document.querySelectorAll('.placement-cell').forEach(cell => {
        cell.classList.remove('selected');
    });
    placementPanelCardIndex = null;
}

// 対象選択モーダルを表示
function showTargetSelection(title, callback) {
    const modal = document.getElementById('targetModal');
    const modalTitle = document.getElementById('targetModalTitle');
    const targetGrid = document.getElementById('targetGrid');
    const confirmBtn = document.getElementById('targetConfirmBtn');
    
    modalTitle.textContent = title;
    targetGrid.innerHTML = '';
    
    let selectedTarget = null;
    
    for (let i = 0; i < 6; i++) {
        const cell = document.createElement('div');
        cell.className = 'target-cell';
        const zone = i < 3 ? 'バトル' : '控え';
        const pos = (i % 3) + 1;
        cell.textContent = `${zone}${pos}`;
        
        cell.addEventListener('click', () => {
            document.querySelectorAll('.target-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            selectedTarget = `相手${zone}ゾーン${pos}`;
            confirmBtn.disabled = false;
        });
        
        targetGrid.appendChild(cell);
    }
    
    const directCell = document.createElement('div');
    directCell.className = 'target-cell';
    directCell.textContent = '直接攻撃';
    directCell.style.gridColumn = 'span 3';
    directCell.addEventListener('click', () => {
        document.querySelectorAll('.target-cell').forEach(c => c.classList.remove('selected'));
        directCell.classList.add('selected');
        selectedTarget = '相手プレイヤー';
        confirmBtn.disabled = false;
    });
    targetGrid.appendChild(directCell);
    
    confirmBtn.disabled = true;
    confirmBtn.onclick = () => {
        if (selectedTarget) {
            callback(selectedTarget);
            modal.classList.remove('active');
        }
    };
    
    modal.classList.add('active');
}

// 翻訳関数
function translate(key, value) {
    return translations[key]?.[value] || value;
}

// カード画像のパスを取得
function getCardImagePath(card) {
    if (!card || !card.card) return 'img/monster.png';
    
    const cardName = card.card.cardName.replace(/[\/\\:*?"<>|]/g, '');
    const imagePath = `cardimg/${cardName}.png`;
    
    let defaultImage = 'img/monster.png';
    if (card.card.cardBase === 'ex') {
        defaultImage = 'img/ex.png';
    } else if (card.card.cardBase === 'magic') {
        defaultImage = 'img/magic.png';
    } else if (card.card.cardBase === 'supporter') {
        defaultImage = 'img/supporter.png';
    }
    
    return { primary: imagePath, fallback: defaultImage, showName: false };
}

// カード詳細を表示
function displayCardDetail(card, source) {
    if (!card || !card.card) {
        document.getElementById('cardDetailName').textContent = 'カード未選択';
        document.getElementById('cardDetailStats').innerHTML = '<span>種類: -</span>';
        document.getElementById('cardDetailBody').innerHTML = '<div class="detail-section"><div class="detail-label">説明</div><div class="detail-content">カードを選択すると詳細が表示されます</div></div>';
        document.getElementById('cardDetailImage').src = 'img/monster.png';
        return;
    }
    
    const c = card.card;
    
    document.getElementById('cardDetailName').textContent = c.cardName;
    
    let statsHTML = `<span>種類: ${translate('cardBase', c.cardBase)}</span>`;
    if (c.attribute) statsHTML += `<span>属性: ${translate('attribute', c.attribute)}</span>`;
    if (c.monsterType) statsHTML += `<span>タイプ: ${translate('monsterType', c.monsterType)}</span>`;
    
    if (c.cardBase === 'monster' || c.cardBase === 'ex') {
        if (c.attack !== undefined) statsHTML += `<span>⚔️ ${c.attack}</span>`;
        if (c.hp !== undefined) statsHTML += `<span>❤️ ${c.hp}</span>`;
        if (card.currentDamage) statsHTML += `<span>累積ダメージ: ${card.currentDamage}</span>`;
    }
    
    if ((c.cardBase === 'magic' || c.cardBase === 'supporter') && c.magicCost !== undefined) {
        statsHTML += `<span>💎 ${c.magicCost}</span>`;
    }
    
    document.getElementById('cardDetailStats').innerHTML = statsHTML;
    
    let bodyHTML = '';
    if (c.tribe) {
        bodyHTML += `<div class="detail-section"><div class="detail-label">種族</div><div class="detail-content">${c.tribe}</div></div>`;
    }
    if (c.evolutionSource) {
        bodyHTML += `<div class="detail-section"><div class="detail-label">進化元</div><div class="detail-content">${c.evolutionSource}</div></div>`;
    }
    if (c.magicCost !== undefined && c.cardBase !== 'supporter') {
        bodyHTML += `<div class="detail-section"><div class="detail-label">コスト</div><div class="detail-content">${c.magicCost}</div></div>`;
    }
    if (c.contentText) {
        bodyHTML += `<div class="detail-section"><div class="detail-label">効果</div><div class="detail-content">${c.contentText}</div></div>`;
    }
    if (c.skills && c.skills.length > 0) {
        c.skills.forEach(skill => {
            bodyHTML += `<div class="detail-section"><div class="detail-label">${skill.type === 'A' ? 'アタックスキル' : 'パッシブスキル'}: ${skill.name}</div><div class="detail-content">${skill.text || '-'}</div></div>`;
        });
    }
    if (c.supplementText) {
        bodyHTML += `<div class="detail-section"><div class="detail-label">補足</div><div class="detail-content">${c.supplementText}</div></div>`;
    }
    document.getElementById('cardDetailBody').innerHTML = bodyHTML || '<div class="detail-section"><div class="detail-label">説明</div><div class="detail-content">-</div></div>';
    
    const imgData = getCardImagePath(card);
    const img = document.getElementById('cardDetailImage');
    img.src = imgData.primary;
    img.style.cursor = 'pointer';
    img.onerror = () => { img.src = imgData.fallback; };
    
    img.onclick = () => {
        document.getElementById('imageModalContent').src = img.src;
        document.getElementById('imageModal').classList.add('active');
    };
}

// UIを更新
function renderUI() {
    const isMyTurn = gameState.currentPlayer === 1;
    
    const statusValues = document.querySelectorAll('.status-value');
    statusValues[0].textContent = gameState.players[0].hp;
    statusValues[1].textContent = gameState.players[0].shield;
    statusValues[2].textContent = `${gameState.players[0].mana}/${gameState.players[0].maxMana}`;
    statusValues[3].textContent = gameState.players[1].hp;
    statusValues[4].textContent = gameState.players[1].shield;
    statusValues[5].textContent = `${gameState.players[1].mana}/${gameState.players[1].maxMana}`;
    
    const turnText = isMyTurn ? 'あなたのターン' : '相手のターン';
    document.getElementById('turnStatus').textContent = `${gameState.turn} - ${turnText}`;

    const logDisplay = document.getElementById('logDisplay');
    logDisplay.innerHTML = '';
    
    // プライベートログと通常ログを統合して時間順に表示
    const allLogs = [...gameState.privateLogs.map(log => ({...log, type: 'private'})), ...gameState.logs].sort((a, b) => a.time - b.time);
    
    allLogs.forEach(log => {
        const entry = document.createElement('div');
        entry.className = `log-entry ${log.type}`;
        const labelText = {
            'system': '[システム]',
            '1P': '[1P]',
            '2P': '[2P]',
            'chat': '[1P][C]',
            'private': '[自分専用]'
        }[log.type] || '';
        
        const timeStr = new Date(log.time).toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        
        entry.innerHTML = `<span class="log-time">${timeStr}</span><span class="log-label">${labelText}</span><span>${log.message}</span>`;
        logDisplay.appendChild(entry);
    });
    logDisplay.scrollTop = logDisplay.scrollHeight;

    const zoneToggleBtn = document.getElementById('zoneToggleBtn');
    const zoneNames = {
        'hand': '手札',
        'free': 'フリー',
        'graveyard': '墓地確認',
        'deck': '山札確認',
        'ex': 'EX確認'
    };
    zoneToggleBtn.textContent = zoneNames[gameState.handZoneMode] || '手札';

    renderCards();
    renderField();
    updateMenuButtons();
    updateCounterApplyButton();
    updateUIInteractivity(isMyTurn);
}

// カード表示
// renderCards関数を修正
function renderCards() {
    const handZone = document.getElementById('handZone');
    const toggleBtn = document.getElementById('zoneToggleBtn');
    
    Array.from(handZone.children).forEach(child => {
        if (child !== toggleBtn) {
            child.remove();
        }
    });

    let cardsToShow = [];
    let sourceType = 'hand';
    
    switch(gameState.handZoneMode) {
        case 'hand':
            cardsToShow = gameState.players[1].hand;
            sourceType = 'hand';
            break;
        case 'free':
            cardsToShow = gameState.players[1].free || [];
            sourceType = 'free';
            break;
        case 'graveyard':
            cardsToShow = gameState.players[1].graveyard;
            sourceType = 'graveyard';
            toggleBtn.textContent = '墓地確認中';
            break;
        case 'deck':
            cardsToShow = gameState.players[1].deck;
            sourceType = 'deck';
            toggleBtn.textContent = '山札確認中';
            break;
        case 'ex':
            cardsToShow = gameState.players[1].ex;
            sourceType = 'ex';
            toggleBtn.textContent = 'EX確認中';
            break;
        case 'opponent-graveyard-view':
            cardsToShow = gameState.players[0].graveyard;
            sourceType = 'opponent-graveyard';
            toggleBtn.textContent = '相手墓地確認中';
            break;
        case 'opponent-deck-view':
            cardsToShow = gameState.players[0].deck;
            sourceType = 'opponent-deck';
            toggleBtn.textContent = '相手山札確認中';
            break;
        case 'opponent-ex-view':
            cardsToShow = gameState.players[0].ex;
            sourceType = 'opponent-ex';
            toggleBtn.textContent = '相手EX確認中';
            break;
    }
    
    // 確認モード時はボタンを手札に戻るボタンに変更
    if (['graveyard', 'deck', 'ex', 'opponent-graveyard-view', 'opponent-deck-view', 'opponent-ex-view'].includes(gameState.handZoneMode)) {
        toggleBtn.textContent = '手札表示に戻る';
        toggleBtn.onclick = () => {
            gameState.handZoneMode = 'hand';
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            renderUI();
        };
    } else {
        // 通常モード時は元のトグル機能
        const zoneNames = {
            'hand': '手札',
            'free': 'フリー'
        };
        toggleBtn.textContent = zoneNames[gameState.handZoneMode] || '手札';
        toggleBtn.onclick = () => {
            const modes = ['hand', 'free'];
            const currentIndex = modes.indexOf(gameState.handZoneMode);
            const nextIndex = (currentIndex + 1) % modes.length;
            gameState.handZoneMode = modes[nextIndex];
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            gameState.selectedFieldCell = null;
            gameState.selectedFieldPosition = null;
            document.querySelectorAll('.field-area .field-cell').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.field-grid .field-cell').forEach(c => c.classList.remove('selected'));
            renderUI();
        };
    }
    
    cardsToShow.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'hand-card';
        cardDiv.dataset.index = index;
        cardDiv.dataset.source = sourceType;
        
        if (gameState.mulliganPhase && sourceType === 'hand' && gameState.mulliganSelected.includes(index)) {
            cardDiv.classList.add('selected');
        }
        
        if (gameState.selectedCard === card && gameState.selectedCardSource === sourceType) {
            cardDiv.classList.add('selected');
        }
        
        const imgData = getCardImagePath(card);
        const img = document.createElement('img');
        img.src = imgData.primary;
        img.onerror = () => {
            img.src = imgData.fallback;
            if (!cardDiv.querySelector('.hand-card-name')) {
                const nameDiv = document.createElement('div');
                nameDiv.className = 'hand-card-name';
                nameDiv.textContent = card.card ? card.card.cardName : 'カード';
                cardDiv.appendChild(nameDiv);
            }
        };
        cardDiv.appendChild(img);
        
        cardDiv.addEventListener('click', () => {
            if (gameState.mulliganPhase && sourceType === 'hand') {
                const idx = gameState.mulliganSelected.indexOf(index);
                if (idx > -1) {
                    gameState.mulliganSelected.splice(idx, 1);
                } else {
                    gameState.mulliganSelected.push(index);
                }
                updateActionPanel('mulligan');
                renderCards();
                renderUI();
            } else {
                document.querySelectorAll('.hand-card').forEach(c => c.classList.remove('selected'));
                cardDiv.classList.add('selected');
                gameState.selectedCard = card;
                gameState.selectedCardSource = sourceType;

                if (!gameState.mulliganPhase) {
                    document.querySelectorAll('.field-area .field-cell').forEach(c => c.classList.remove('selected'));
                    document.querySelectorAll('.field-grid .field-cell').forEach(c => c.classList.remove('selected'));
                    gameState.selectedFieldCell = null;
                    gameState.selectedFieldPosition = null;
                    updateCounterApplyButton();
                }

                displayCardDetail(card, sourceType);
                updateActionPanel(sourceType);
            }
        });
        
        handZone.appendChild(cardDiv);
    });
}


// フィールド描画
function renderField() {
    // 自分の場の描画
    document.querySelectorAll('.field-area:not(.opponent) .field-cell').forEach(cell => {
        const zone = cell.dataset.zone;
        
        if (zone === 'counter') {
            const existing = cell.querySelector('img.field-monster');
            if (existing) existing.remove();
            
            const counterCard = gameState.players[1].field.counter;
            const img = cell.querySelector('img');
            if (counterCard) {
                if (img) {
                    img.src = 'img/reverse.png';
                    img.style.display = 'block';
                }
            } else {
                if (img) {
                    img.style.display = 'none';
                }
            }
        } else if (zone === 'battle' || zone === 'reserve') {
            const siblings = Array.from(document.querySelectorAll(`.field-area .field-cell[data-zone="${zone}"]`));
            const idx = siblings.indexOf(cell);
            const monster = gameState.players[1].field[zone][idx];

            const existing = cell.querySelector('img.field-monster');
            if (existing) existing.remove();
            const overlay = cell.querySelector('.field-overlay');
            if (overlay && !monster) overlay.remove();
            const nameEl = cell.querySelector('.field-card-name');
            if (nameEl && !monster) nameEl.remove();

            if (monster) {
                const imgData = getCardImagePath(monster);
                const img = document.createElement('img');
                img.className = 'field-monster';
                img.src = imgData.primary;
                img.alt = monster.card.cardName || 'モンスター';
                img.onload = () => {
                    const n = cell.querySelector('.field-card-name');
                    if (n) n.remove();
                };
                img.onerror = () => {
                    img.src = imgData.fallback;
                    if (!cell.querySelector('.field-card-name')) {
                        const nameDiv = document.createElement('div');
                        nameDiv.className = 'field-card-name';
                        nameDiv.textContent = monster.card.cardName || '';
                        cell.appendChild(nameDiv);
                    }
                };
                cell.insertBefore(img, cell.firstChild);

                let ov = cell.querySelector('.field-overlay');
                if (!ov) {
                    ov = document.createElement('div');
                    ov.className = 'field-overlay';
                    cell.appendChild(ov);
                }
                const hp = monster.card.hp !== undefined ? monster.card.hp : '-';
                const dmg = monster.currentDamage || 0;
                ov.textContent = `HP:${hp} D:${dmg}`;
            }
        }
    });


    // 相手の手札エリアの描画（枚数表示を右寄せ）
    const opponentHandZone = document.querySelector('.field-area.opponent .field-row.hand-zone');
    if (opponentHandZone) {
        opponentHandZone.innerHTML = '';
        opponentHandZone.style.justifyContent = 'flex-end'; // 右寄せ
        opponentHandZone.style.paddingRight = '1rem';
        
        const handCount = gameState.players[0].hand.length;
        const countDisplay = document.createElement('div');
        countDisplay.style.display = 'flex';
        countDisplay.style.alignItems = 'center';
        countDisplay.style.gap = '0.5rem';
        countDisplay.style.color = 'var(--text-color)';
        countDisplay.style.fontSize = '0.9rem';
        countDisplay.style.fontWeight = 'bold';
        
        const label = document.createElement('span');
        label.textContent = '相手の手札:';
        countDisplay.appendChild(label);
        
        const count = document.createElement('span');
        count.textContent = `${handCount}枚`;
        count.style.color = 'var(--accent-color)';
        countDisplay.appendChild(count);
        
        opponentHandZone.appendChild(countDisplay);
    }
}

function updateMenuButtons() {
    const coinTossBtn = document.getElementById('coinTossBtn');
    const turnEndBtn = document.getElementById('turnEndBtn');
    const mulliganEndBtn = document.getElementById('mulliganEndBtn');

    if (gameState.mulliganPhase) {
        coinTossBtn.style.display = 'block';
        turnEndBtn.style.display = 'none';
        mulliganEndBtn.style.display = 'block';
    } else {
        coinTossBtn.style.display = 'block';
        turnEndBtn.style.display = 'block';
        mulliganEndBtn.style.display = 'none';
    }
}

function updateCounterApplyButton() {
    const applyBtn = document.getElementById('counterApplyBtn');
    const cellSelected = gameState.selectedFieldCell !== null;
    
    if (!cellSelected) {
        applyBtn.disabled = true;
        return;
    }

    const zone = gameState.selectedFieldCell < 3 ? 'battle' : 'reserve';
    const index = gameState.selectedFieldCell % 3;
    const hasMonster = gameState.players[1].field[zone][index] !== null;
    
    applyBtn.disabled = !hasMonster;
}

function syncFieldSelection() {
    document.querySelectorAll('.field-cell').forEach(c => {
        c.classList.remove('selected');
    });

    if (gameState.selectedFieldCell == null) return;

    const mini = document.querySelector(
        `.field-grid .field-cell.mini[data-pos="${gameState.selectedFieldCell}"]`
    );
    if (mini) mini.classList.add('selected');

    const zone = gameState.selectedFieldCell < 3 ? 'battle' : 'reserve';
    const index = gameState.selectedFieldCell % 3;

    const fieldCells = document.querySelectorAll(
        `.field-area:not(.opponent) .field-cell[data-zone="${zone}"]`
    );
    if (fieldCells[index]) fieldCells[index].classList.add('selected');

    updateCounterApplyButton();
}

function updateUIInteractivity(isMyTurn) {
    const turnEndBtn = document.getElementById('turnEndBtn');
    const counterValue = document.getElementById('counterValue');
    const counterMinus = document.getElementById('counterMinus');
    const counterPlus = document.getElementById('counterPlus');
    const counterApplyBtn = document.getElementById('counterApplyBtn');
    
    if (!isMyTurn) {
        turnEndBtn.disabled = false;
        counterValue.disabled = true;
        counterMinus.disabled = true;
        counterPlus.disabled = true;
        counterApplyBtn.disabled = true;
    } else {
        turnEndBtn.disabled = false;
        counterValue.disabled = false;
        counterMinus.disabled = false;
        counterPlus.disabled = false;
    }
}

// ===== UIイベントハンドラ =====

// リサイズ機能
let isResizing = false;
let currentResizer = null;

document.getElementById('leftResizer').addEventListener('mousedown', () => {
    isResizing = true;
    currentResizer = 'left';
});

document.getElementById('rightResizer').addEventListener('mousedown', () => {
    isResizing = true;
    currentResizer = 'right';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    if (currentResizer === 'left') {
        const leftPanel = document.getElementById('leftPanel');
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
            leftPanel.style.width = newWidth + 'px';
        }
    } else if (currentResizer === 'right') {
        const rightPanel = document.getElementById('rightPanel');
        const newWidth = window.innerWidth - e.clientX;
        if (newWidth >= 200 && newWidth <= 500) {
            rightPanel.style.width = newWidth + 'px';
            document.querySelector('.menu-toggle').style.right = `calc(${newWidth}px + 2rem)`;
            document.querySelector('.menu-panel').style.right = `calc(${newWidth}px + 2rem)`;
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    currentResizer = null;
});

// メニュートグル
document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('menuPanel').classList.toggle('active');
});

// コイントス
document.getElementById('coinTossBtn').addEventListener('click', () => {
    executeAction({ type: 'COIN_TOSS' });
    document.getElementById('menuPanel').classList.remove('active');
});

// ターンエンド
document.getElementById('turnEndBtn').addEventListener('click', () => {
    executeAction({ type: 'TURN_END' });
    document.getElementById('menuPanel').classList.remove('active');
});

// 手札決定(引き直し終了)
document.getElementById('mulliganEndBtn').addEventListener('click', () => {
    executeAction({ type: 'MULLIGAN_RETURN' });
    document.getElementById('menuPanel').classList.remove('active');
});

// マナ回復
document.getElementById('manaRecoverBtn').addEventListener('click', () => {
    const amount = prompt('回復するマナの量を入力してください:', '10');
    if (amount !== null && !isNaN(amount)) {
        executeAction({ type: 'RECOVER_MANA', amount: parseInt(amount) });
    }
    document.getElementById('menuPanel').classList.remove('active');
});

// デッキ読み込み
document.getElementById('loadDeckBtn').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const deckData = JSON.parse(event.target.result);
                loadDeck(deckData);
                gameState.logs.push({
                    type: 'system',
                    message: 'デッキを読み込みました',
                    time: Date.now()
                });
                renderUI();
            } catch (error) {
                alert('デッキの読み込みに失敗しました: ' + error.message);
            }
        };
        reader.readAsText(file);
    };
    input.click();
    document.getElementById('menuPanel').classList.remove('active');
});

// フィールドセル選択(場)
document.querySelectorAll('.field-area:not(.opponent) .field-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        const isMyTurn = gameState.currentPlayer === 1;
        const zone = cell.dataset.zone;

        if (['graveyard', 'deck', 'ex'].includes(zone)) {
            document.querySelectorAll('.field-area:not(.opponent) .field-cell')
                .forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            
            if (zone === 'counter') {
                const counterCard = gameState.players[1].field.counter;
                if (counterCard) {
                    displayCardDetail(counterCard, 'counter');
                }
            }
            
            updateActionPanel(zone);
            return;
        }

        if (zone === 'counter') {
            document.querySelectorAll('.field-area:not(.opponent) .field-cell')
                .forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            const counterCard = gameState.players[1].field.counter;
            if (counterCard) {
                displayCardDetail(counterCard, 'counter');
            }
            return;
        }

        if (!isMyTurn) return;

        if (!gameState.mulliganPhase) {
            document.querySelectorAll('.hand-card')
                .forEach(c => c.classList.remove('selected'));
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            renderCards();
        }

        if (zone !== 'battle' && zone !== 'reserve') return;

        const siblings = Array.from(
            document.querySelectorAll(`.field-area:not(.opponent) .field-cell[data-zone="${zone}"]`)
        );
        const index = siblings.indexOf(cell);
        if (index === -1) return;

        const miniPos = zone === 'battle' ? index : index + 3;
        const monster = gameState.players[1].field[zone][index];

        gameState.selectedFieldCell = miniPos;
        gameState.selectedFieldPosition = {
            zone: miniPos < 3 ? 'battle' : 'reserve',
            index: miniPos % 3
        };
        gameState.selectedFieldMonster = monster;

        syncFieldSelection();

        if (monster) {
            displayCardDetail(monster, 'field');
            updateActionPanel('field');
        } else {
            displayCardDetail(null);
            updateActionPanel(zone);
        }
    });
});

// フィールドセル選択(簡略図)
document.querySelectorAll('.field-grid .field-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        document.querySelectorAll('.field-grid .field-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        
        const pos = parseInt(cell.dataset.pos);
        gameState.selectedFieldCell = pos;
        
        const zone = pos < 3 ? 'battle' : 'reserve';
        const index = pos % 3;
        gameState.selectedFieldPosition = { zone: zone, index: index };
        const monster = gameState.players[1].field[zone][index];
        gameState.selectedFieldMonster = monster;
        
        syncFieldSelection();
        
        updateCounterApplyButton();

        if (!gameState.mulliganPhase) {
            document.querySelectorAll('.hand-card').forEach(c => c.classList.remove('selected'));
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            renderCards();
        }

        document.querySelectorAll('.field-area .field-cell').forEach(c => c.classList.remove('selected'));
        const mainCells = Array.from(document.querySelectorAll(`.field-area .field-cell[data-zone="${zone}"]`));
        const mainCell = mainCells[index];
        if (mainCell) mainCell.classList.add('selected');
        
        if (monster) {
            displayCardDetail(monster, 'field');
            updateActionPanel('field');
        } else {
            displayCardDetail(null);
            if (gameState.selectedCard && gameState.selectedCardSource === 'hand' && !gameState.mulliganPhase) {
                updateActionPanel('hand');
            } else {
                updateActionPanel(zone);
            }
        }
    });
});



// カウンター操作
document.getElementById('counterMinus').addEventListener('click', () => {
    const input = document.getElementById('counterValue');
    input.value = parseInt(input.value || 0) - 10;
});

document.getElementById('counterPlus').addEventListener('click', () => {
    const input = document.getElementById('counterValue');
    input.value = parseInt(input.value || 0) + 10;
});

document.getElementById('counterApplyBtn').addEventListener('click', () => {
    const value = parseInt(document.getElementById('counterValue').value || 0);
    if (gameState.selectedFieldCell !== null) {
        executeAction({
            type: 'APPLY_DAMAGE',
            cellIndex: gameState.selectedFieldCell,
            value: value
        });
    }
});

// チャット送信
document.getElementById('chatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        executeAction({ 
            type: 'CHAT', 
            message: e.target.value 
        });
        e.target.value = '';
    }
});

// 独立パネルのセルクリックイベント
document.querySelectorAll('.placement-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        if (cell.classList.contains('disabled')) return;
        
        document.querySelectorAll('.placement-cell').forEach(c => c.classList.remove('selected'));
        cell.classList.add('selected');
        
        document.getElementById('placementConfirmBtn').disabled = false;
    });
});

// キャンセルボタン
document.getElementById('placementCancelBtn').addEventListener('click', () => {
    hidePlacementPanel();
});

// 場に出す確定ボタン
document.getElementById('placementConfirmBtn').addEventListener('click', () => {
    const selectedCell = document.querySelector('.placement-cell.selected');
    if (!selectedCell) return;
    
    const zone = selectedCell.dataset.zone;
    const index = parseInt(selectedCell.dataset.index);
    
    if (placementPanelCardIndex === -1 && gameState.selectedFieldMonster) {
        const currentPos = gameState.selectedFieldPosition;
        const currentMonster = gameState.players[1].field[currentPos.zone][currentPos.index];
        const targetMonster = gameState.players[1].field[zone][index];
        
        if (targetMonster) {
            gameState.players[1].field[zone][index] = currentMonster;
            gameState.players[1].field[currentPos.zone][currentPos.index] = targetMonster;
            gameState.logs.push({
                type: 'system',
                message: `${currentMonster.card.cardName}と${targetMonster.card.cardName}の位置を交換しました`,
                time: Date.now()
            });
        } else {
            gameState.players[1].field[zone][index] = currentMonster;
            gameState.players[1].field[currentPos.zone][currentPos.index] = null;
            gameState.logs.push({
                type: 'system',
                message: `${currentMonster.card.cardName}を移動しました`,
                time: Date.now()
            });
        }
        
        gameState.selectedFieldMonster = null;
        hidePlacementPanel();
        renderUI();
        return;
    }
    
    if (placementPanelCardIndex !== null) {
        executeAction({
            type: 'PLACE_MONSTER',
            source: 'hand',
            index: placementPanelCardIndex,
            position: { zone: zone, index: index }
        });
        
        hidePlacementPanel();
    }
});

// 画像拡大モーダルを閉じる
document.getElementById('imageModalClose').addEventListener('click', () => {
    document.getElementById('imageModal').classList.remove('active');
});

document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.id === 'imageModal') {
        document.getElementById('imageModal').classList.remove('active');
    }
});

// 対象選択モーダルのキャンセル
document.getElementById('targetCancelBtn').addEventListener('click', () => {
    document.getElementById('targetModal').classList.remove('active');
});

// アクションを実行
function executeAction(action) {
    const isMyTurn = gameState.currentPlayer === 1;
    
    switch(action.type) {
        case 'COIN_TOSS':
            const result = Math.random() < 0.5 ? '表' : '裏';
            gameState.logs.push({
                type: '1P',
                message: `コインTOSSをしました: ${result}`,
                time: Date.now()
            });
            break;
            
        case 'CHAT':
            gameState.logs.push({
                type: 'chat',
                message: action.message,
                time: Date.now()
            });
            break;
            
        case 'DRAW':
            if (gameState.players[1].deck.length > 0) {
                const drawnCard = gameState.players[1].deck.shift();
                gameState.players[1].hand.push(drawnCard);
                gameState.logs.push({
                    type: 'system',
                    message: '1Pがカードを1枚ドローしました',
                    time: Date.now()
                });
                gameState.privateLogs.push({
                    type: 'private',
                    message: `カードを1枚ドローしました: ${drawnCard.card.cardName}`,
                    time: Date.now()
                });
            }
            break;
            
        case 'INITIAL_DRAW':
            for (let i = 0; i < 5; i++) {
                if (gameState.players[1].deck.length > 0) {
                    const drawnCard = gameState.players[1].deck.shift();
                    gameState.players[1].hand.push(drawnCard);
                }
            }
            gameState.logs.push({
                type: 'system',
                message: '初期手札を5枚ドローしました',
                time: Date.now()
            });
            break;
            
        case 'MULLIGAN_RETURN':
            const count = gameState.mulliganSelected.length;
            const returnedCards = [];
            if (count > 0) {
                gameState.mulliganSelected.sort((a, b) => b - a).forEach(index => {
                    const card = gameState.players[1].hand.splice(index, 1)[0];
                    gameState.players[1].deck.push(card);
                    returnedCards.push(card.card.cardName);
                });
                
                shuffleDeck(1);
                
                const drawnCards = [];
                for (let i = 0; i < count; i++) {
                    if (gameState.players[1].deck.length > 0) {
                        const drawnCard = gameState.players[1].deck.shift();
                        gameState.players[1].hand.push(drawnCard);
                        drawnCards.push(drawnCard.card.cardName);
                    }
                }
                
                gameState.privateLogs.push({
                    type: 'private',
                    message: `${count}枚のカードを引き直しました（戻したカード: ${returnedCards.join(', ')}、引いたカード: ${drawnCards.join(', ')}）`,
                    time: Date.now()
                });
                
                gameState.logs.push({
                    type: 'system',
                    message: `1Pが${count}枚のカードを引き直しました`,
                    time: Date.now()
                });
            } else {
                gameState.logs.push({
                    type: 'system',
                    message: '1Pは引き直しを行いませんでした',
                    time: Date.now()
                });
            }
            
            gameState.mulliganPhase = false;
            gameState.mulliganSelected = [];
            break;
        
        case 'ADD_TO_HAND':
            if (action.source === 'deck' && action.index !== undefined) {
                const card = gameState.players[1].deck.splice(action.index, 1)[0];
                gameState.players[1].hand.push(card);
                gameState.logs.push({ 
                    type: 'system', 
                    message: '1Pが山札からカードを手札に加えました', 
                    time: Date.now() 
                });
                gameState.privateLogs.push({ 
                    type: 'private', 
                    message: `山札からカードを手札に加えました: ${card.card.cardName}`, 
                    time: Date.now() 
                });
            } else if (action.source === 'graveyard' && action.index !== undefined) {
                const card = gameState.players[1].graveyard.splice(action.index, 1)[0];
                gameState.players[1].hand.push(card);
                gameState.logs.push({ 
                    type: 'system', 
                    message: '1Pが墓地からカードを手札に加えました', 
                    time: Date.now() 
                });
                gameState.privateLogs.push({ 
                    type: 'private', 
                    message: `墓地からカードを手札に加えました: ${card.card.cardName}`, 
                    time: Date.now() 
                });
            } else if (action.source === 'ex' && action.index !== undefined) {
                const card = gameState.players[1].ex.splice(action.index, 1)[0];
                gameState.players[1].hand.push(card);
                gameState.logs.push({ 
                    type: 'system', 
                    message: '1PがEXからカードを手札に加えました', 
                    time: Date.now() 
                });
                gameState.privateLogs.push({ 
                    type: 'private', 
                    message: `EXからカードを手札に加えました: ${card.card.cardName}`, 
                    time: Date.now() 
                });
            } else if (action.source === 'free' && action.index !== undefined) {
                const card = gameState.players[1].free.splice(action.index, 1)[0];
                gameState.players[1].hand.push(card);
                gameState.logs.push({ 
                    type: 'system', 
                    message: '1Pがフリーゾーンからカードを手札に加えました', 
                    time: Date.now() 
                });
                gameState.privateLogs.push({ 
                    type: 'private', 
                    message: `フリーゾーンからカードを手札に加えました: ${card.card.cardName}`, 
                    time: Date.now() 
                });
            }
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            break;
        case 'RETURN_TO_DECK':
            if (action.source && action.index !== undefined) {
                let card;
                if (action.source === 'hand') {
                    card = gameState.players[1].hand.splice(action.index, 1)[0];
                } else if (action.source === 'graveyard') {
                    card = gameState.players[1].graveyard.splice(action.index, 1)[0];
                } else if (action.source === 'ex') {
                    card = gameState.players[1].ex.splice(action.index, 1)[0];
                } else if (action.source === 'free') {
                    card = gameState.players[1].free.splice(action.index, 1)[0];
                }
                
                if (card) {
                    gameState.players[1].deck.push(card);
                    shuffleDeck(1);
                    gameState.logs.push({ type: 'system', message: `1Pがカードをデッキに戻しました: ${card.card.cardName}`, time: Date.now() });
                }
            }
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            break;
            
        case 'ADD_TO_FREE':
            if (action.source && action.index !== undefined) {
                let card;
                if (action.source === 'hand') {
                    card = gameState.players[1].hand.splice(action.index, 1)[0];
                } else if (action.source === 'graveyard') {
                    card = gameState.players[1].graveyard.splice(action.index, 1)[0];
                } else if (action.source === 'ex') {
                    card = gameState.players[1].ex.splice(action.index, 1)[0];
                }
                
                if (card) {
                    if (!gameState.players[1].free) gameState.players[1].free = [];
                    gameState.players[1].free.push(card);
                    gameState.logs.push({ type: 'system', message: `1Pがカードをフリーゾーンに移動しました: ${card.card.cardName}`, time: Date.now() });
                }
            }
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            break;
            
        case 'ACTIVATE_EFFECT':
            if (gameState.selectedCard) {
                gameState.logs.push({ 
                    type: '1P', 
                    message: `${gameState.selectedCard.card.cardName}の効果を発動しました`,
                    time: Date.now()
                });
            }
            break;
            
        case 'SEND_TO_GRAVEYARD':
            if (action.source && action.index !== undefined) {
                let card;
                if (action.source === 'hand') {
                    card = gameState.players[1].hand.splice(action.index, 1)[0];
                } else if (action.source === 'free') {
                    card = gameState.players[1].free.splice(action.index, 1)[0];
                }
                
                if (card) {
                    gameState.players[1].graveyard.push(card);
                    gameState.logs.push({ type: 'system', message: `1Pがカードを墓地に送りました: ${card.card.cardName}`, time: Date.now() });
                }
            }
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            break;
            
        case 'PLACE_MONSTER':
            if (action.source === 'hand' && action.index !== undefined && action.position) {
                const card = gameState.players[1].hand[action.index];
                const zone = action.position.zone;
                const index = action.position.index;
                const targetCell = gameState.players[1].field[zone][index];
                const zoneName = zone === 'battle' ? 'バトル' : '控え';
                
                if (card.card.monsterType === '通常' && targetCell === null) {
                    const placedCard = gameState.players[1].hand.splice(action.index, 1)[0];
                    gameState.players[1].field[zone][index] = placedCard;
                    gameState.logs.push({ 
                        type: 'system', 
                        message: `1Pが${zoneName}ゾーンにモンスターを出しました: ${placedCard.card.cardName}`,
                        time: Date.now()
                    });
                    gameState.selectedCard = null;
                    gameState.selectedCardSource = null;
                } else if (card.card.monsterType === '特殊進化' && targetCell !== null) {
                    const placedCard = gameState.players[1].hand.splice(action.index, 1)[0];
                    const underCard = gameState.players[1].field[zone][index];
                    gameState.players[1].field[zone][index] = placedCard;
                    placedCard.underCard = underCard;
                    gameState.logs.push({ 
                        type: 'system', 
                        message: `1Pが${zoneName}ゾーンで特殊進化しました: ${underCard.card.cardName}の上に${placedCard.card.cardName}`,
                        time: Date.now()
                    });
                    gameState.selectedCard = null;
                    gameState.selectedCardSource = null;
                } else {
                    gameState.logs.push({
                        type: 'system',
                        message: '配置できませんでした',
                        time: Date.now()
                    });
                }
            }
            break;
            
        case 'ACTIVATE_MAGIC':
            if (action.source === 'hand' && action.index !== undefined) {
                const card = gameState.players[1].hand[action.index];
                const cost = card.card.magicCost || 0;
                
                if (gameState.players[1].mana >= cost) {
                    gameState.players[1].mana -= cost;
                    const activatedCard = gameState.players[1].hand.splice(action.index, 1)[0];
                    gameState.players[1].graveyard.push(activatedCard);
                    gameState.logs.push({ 
                        type: '1P', 
                        message: `${activatedCard.card.cardName}を発動しました(コスト: ${cost})`,
                        time: Date.now()
                    });
                    gameState.selectedCard = null;
                    gameState.selectedCardSource = null;
                } else {
                    gameState.logs.push({ 
                        type: 'system', 
                        message: `マナが足りません(必要: ${cost}、所持: ${gameState.players[1].mana})`,
                        time: Date.now()
                    });
                }
            }
            break;
            
        case 'SET_COUNTER':
            if (action.source === 'hand' && action.index !== undefined) {
                const card = gameState.players[1].hand.splice(action.index, 1)[0];
                gameState.players[1].field.counter = card;
                gameState.logs.push({ 
                    type: 'system', 
                    message: '1Pがカウンターゾーンにカードをセットしました',
                    time: Date.now()
                });
                gameState.selectedCard = null;
                gameState.selectedCardSource = null;
            }
            break;
            
        case 'ACTIVATE_SUPPORTER':
            if (action.source === 'hand' && action.index !== undefined) {
                if (!gameState.usedSupporterThisTurn) {
                    const card = gameState.players[1].hand.splice(action.index, 1)[0];
                    gameState.players[1].graveyard.push(card);
                    gameState.usedSupporterThisTurn = true;
                    gameState.logs.push({ 
                        type: '1P', 
                        message: `${card.card.cardName}を発動しました`,
                        time: Date.now()
                    });
                    gameState.selectedCard = null;
                    gameState.selectedCardSource = null;
                } else {
                    gameState.logs.push({ 
                        type: 'system', 
                        message: 'このターンは既にサポーターを使用しています',
                        time: Date.now()
                    });
                }
            }
            break;

        case 'TURN_END':
            if (isMyTurn) {
                gameState.currentPlayer = 0;
                gameState.usedSupporterThisTurn = false;
                gameState.logs.push({
                    type: 'system',
                    message: '1Pがターンエンドしました',
                    time: Date.now()
                });
                
                setTimeout(() => {
                    executeAction({ type: 'OPPONENT_TURN_END' });
                }, 500);
            } else {
                // 相手のターンエンド
                gameState.turn++;
                gameState.currentPlayer = 1;
                
                if (gameState.isFirstPlayerFirstTurn) {
                    gameState.isFirstPlayerFirstTurn = false;
                } else {
                    gameState.players[1].maxMana = Math.min(10, gameState.players[1].maxMana + 1);
                    gameState.players[1].mana = gameState.players[1].maxMana;
                    
                    executeAction({ type: 'DRAW' });
                }
                
                gameState.logs.push({
                    type: 'system',
                    message: `ターン${gameState.turn}が開始しました`,
                    time: Date.now()
                });
            }
            break;

        case 'RECOVER_MANA':
                if (action.amount !== undefined) {
                    const oldMana = gameState.players[1].mana;
                    gameState.players[1].mana = Math.min(gameState.players[1].maxMana, gameState.players[1].mana + action.amount);
                    const recovered = gameState.players[1].mana - oldMana;
                    gameState.logs.push({
                        type: 'system',
                        message: `1Pがマナを${recovered}回復しました（${oldMana} → ${gameState.players[1].mana}）`,
                        time: Date.now()
                    });
                }
                break;
            
        case 'APPLY_DAMAGE':
            const zone = action.cellIndex < 3 ? 'battle' : 'reserve';
            const index = action.cellIndex % 3;
            const monster = gameState.players[1].field[zone][index];
            
            if (monster && monster.currentDamage !== undefined) {
                monster.currentDamage += action.value;
                
                const damageText = action.value > 0 ? `${action.value}ダメージ` : `${-action.value}回復`;
                gameState.logs.push({
                    type: 'system',
                    message: `${monster.card.cardName}に${damageText}を与えました(累積: ${monster.currentDamage})`,
                    time: Date.now()
                });
                
                if (monster.card.hp && monster.currentDamage >= monster.card.hp) {
                    gameState.logs.push({
                        type: '1P',
                        message: `${monster.card.cardName}の累積ダメージ(${monster.currentDamage})がHP(${monster.card.hp})を超えました`,
                        time: Date.now()
                    });
                }
                
                document.getElementById('counterValue').value = 0;
            }
            break;
    }
    renderUI();
}

function shuffleDeck(playerIndex, zone = 'deck') {
    let targetDeck;
    if (zone === 'graveyard') {
        targetDeck = gameState.players[playerIndex].graveyard;
    } else {
        targetDeck = gameState.players[playerIndex].deck;
    }
    
    for (let i = targetDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targetDeck[i], targetDeck[j]] = [targetDeck[j], targetDeck[i]];
    }
}


function initOpponentField() {
    const opponentArea = document.querySelector('.field-area.opponent');
    const rows = opponentArea.querySelectorAll('.field-row');
    
    // 1行目（こちらから見て上 = 相手の中段 = 控えゾーン）- EX、控え×3、山札（左右反転）
    rows[0].innerHTML = `
        <div class="field-cell" data-zone="ex" data-pos="1-2" data-player="0">
            <img src="img/reverse.png" alt="EXデッキ">
            <div class="field-cell-label">EX</div>
        </div>
        <div class="field-cell" data-zone="reserve" data-pos="2-2" data-player="0"></div>
        <div class="field-cell" data-zone="reserve" data-pos="3-2" data-player="0"></div>
        <div class="field-cell" data-zone="reserve" data-pos="4-2" data-player="0"></div>
        <div class="field-cell" data-zone="deck" data-pos="5-2" data-player="0">
            <img src="img/reverse.png" alt="山札">
            <div class="field-cell-label">山札</div>
        </div>
    `;
    
// 2行目（相手の中段 = 控えゾーン）- 山札、控え×3、EX（自分の中段の左右反転）
    if (rows[1] && !rows[1].classList.contains('hand-zone')) {
        rows[1].innerHTML = `
            <div class="field-cell" data-zone="deck" data-pos="5-2" data-player="0">
                <img src="img/reverse.png" alt="山札">
                <div class="field-cell-label">山札</div>
            </div>
            <div class="field-cell" data-zone="reserve" data-pos="4-2" data-player="0"></div>
            <div class="field-cell" data-zone="reserve" data-pos="3-2" data-player="0"></div>
            <div class="field-cell" data-zone="reserve" data-pos="2-2" data-player="0"></div>
            <div class="field-cell" data-zone="ex" data-pos="1-2" data-player="0">
                <img src="img/reverse.png" alt="EXデッキ">
                <div class="field-cell-label">EX</div>
            </div>
        `;
    }
    
    // 3行目（相手の上段 = バトルゾーン）- カウンター、バトル×3、墓地（自分の上段の左右反転）
    if (rows[2]) {
        rows[2].innerHTML = `
            <div class="field-cell" data-zone="counter" data-pos="5-1" data-player="0">
                <img src="img/reverse.png" alt="カウンター">
                <div class="field-cell-label">カウンター</div>
            </div>
            <div class="field-cell" data-zone="battle" data-pos="4-1" data-player="0"></div>
            <div class="field-cell" data-zone="battle" data-pos="3-1" data-player="0"></div>
            <div class="field-cell" data-zone="battle" data-pos="2-1" data-player="0"></div>
            <div class="field-cell" data-zone="graveyard" data-pos="1-1" data-player="0">
                <img src="img/reverse.png" alt="墓地">
                <div class="field-cell-label">墓地</div>
            </div>
        `;
    }
    
    // 相手の場のクリックイベント（既存のコード）
    document.querySelectorAll('.field-area.opponent .field-cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const zone = cell.dataset.zone;
            const player = parseInt(cell.dataset.player);
            
            // 自分の場の選択を解除
            document.querySelectorAll('.field-area:not(.opponent) .field-cell')
                .forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.hand-card')
                .forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.field-grid .field-cell')
                .forEach(c => c.classList.remove('selected'));
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            gameState.selectedFieldCell = null;
            gameState.selectedFieldPosition = null;
            gameState.selectedFieldMonster = null;
            
            if (['graveyard', 'deck', 'ex', 'counter'].includes(zone)) {
                document.querySelectorAll('.field-area.opponent .field-cell')
                    .forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                
                // 相手のカード詳細表示
                if (zone === 'graveyard' && gameState.players[0].graveyard.length > 0) {
                    displayCardDetail(gameState.players[0].graveyard[gameState.players[0].graveyard.length - 1], 'opponent-graveyard');
                } else if (zone === 'counter' && gameState.players[0].field.counter) {
                    displayCardDetail(gameState.players[0].field.counter, 'opponent-counter');
                }
                
                updateActionPanel('opponent-' + zone);
                return;
            }
            
            if (zone === 'battle' || zone === 'reserve') {
                const siblings = Array.from(
                    document.querySelectorAll(`.field-area.opponent .field-cell[data-zone="${zone}"]`)
                );
                const index = siblings.indexOf(cell);
                if (index === -1) return;
                
                document.querySelectorAll('.field-area.opponent .field-cell')
                    .forEach(c => c.classList.remove('selected'));
                cell.classList.add('selected');
                
                const monster = gameState.players[0].field[zone][index];
                if (monster) {
                    displayCardDetail(monster, 'opponent-field');
                    updateActionPanel('opponent-field');
                } else {
                    displayCardDetail(null);
                    updateActionPanel('opponent-' + zone);
                }
            }
        });
    });
}


// updateActionPanel関数に相手の場の処理を追加
function updateActionPanel(source) {
    const actionPanel = document.getElementById('actionPanel');
    actionPanel.innerHTML = '';
    
    const isMyTurn = gameState.currentPlayer === 1;

    // 操作後にパネルをクリアする関数
    function clearAfterAction() {
        gameState.selectedCard = null;
        gameState.selectedCardSource = null;
        gameState.selectedFieldCell = null;
        gameState.selectedFieldPosition = null;
        gameState.selectedFieldMonster = null;
        document.querySelectorAll('.field-cell').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.hand-card').forEach(c => c.classList.remove('selected'));
        actionPanel.innerHTML = '';
    }

    // 相手の墓地
    if (source === 'opponent-graveyard') {
        const buttons = ['確認', 'シャッフル', 'ドロー'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'ドロー') {
                btn.addEventListener('click', () => {
                    if (gameState.players[0].deck.length > 0) {
                        const drawnCard = gameState.players[0].deck.shift();
                        gameState.players[0].hand.push(drawnCard);
                        gameState.logs.push({
                            type: 'system',
                            message: `2Pがカードを1枚ドローしました`,
                            time: Date.now()
                        });
                        clearAfterAction();
                        renderUI();
                    }
                });
            } else if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    shuffleDeck(0, 'graveyard');
                    gameState.logs.push({ type: 'system', message: '2Pが墓地をシャッフルしました', time: Date.now() });
                    clearAfterAction();
                    renderUI();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    gameState.handZoneMode = 'opponent-graveyard-view';
                    clearAfterAction();
                    renderUI();
                });
            }
            
            actionPanel.appendChild(btn);
        });
        return;
    }
    
    // 相手の山札
    if (source === 'opponent-deck') {
        const buttons = ['確認', 'シャッフル', 'ドロー'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'ドロー') {
                btn.addEventListener('click', () => {
                    if (gameState.players[0].deck.length > 0) {
                        const drawnCard = gameState.players[0].deck.shift();
                        gameState.players[0].hand.push(drawnCard);
                        gameState.logs.push({
                            type: 'system',
                            message: `2Pがカードを1枚ドローしました`,
                            time: Date.now()
                        });
                        clearAfterAction();
                        renderUI();
                    }
                });
            } else if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    shuffleDeck(0, 'deck');
                    gameState.logs.push({ type: 'system', message: '2Pが山札をシャッフルしました', time: Date.now() });
                    clearAfterAction();
                    renderUI();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    gameState.handZoneMode = 'opponent-deck-view';
                    clearAfterAction();
                    renderUI();
                });
            }
            
            actionPanel.appendChild(btn);
        });
        return;
    }
    
    // 相手のEX
    if (source === 'opponent-ex') {
        const btn = document.createElement('button');
        btn.className = 'action-btn full-width';
        btn.textContent = '確認';
        btn.addEventListener('click', () => {
            gameState.handZoneMode = 'opponent-ex-view';
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(btn);
        return;
    }

    // 相手のフィールドモンスター
    if (source === 'opponent-field') {
        const info = document.createElement('div');
        info.className = 'action-btn full-width';
        info.style.cursor = 'default';
        info.textContent = '相手のモンスター（情報表示のみ）';
        actionPanel.appendChild(info);
        return;
    }

    // 自分の墓地
    if (source === 'graveyard') {
        const buttons = ['確認', 'シャッフル'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    shuffleDeck(1, 'graveyard');
                    gameState.logs.push({ type: 'system', message: '1Pが墓地をシャッフルしました', time: Date.now() });
                    clearAfterAction();
                    renderUI();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    gameState.handZoneMode = 'graveyard';
                    clearAfterAction();
                    renderUI();
                });
            }
            
            actionPanel.appendChild(btn);
        });
        return;
    }
    
    // 自分の山札
    if (source === 'deck') {
        const buttons = ['確認', 'シャッフル', 'ドロー'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'ドロー') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'DRAW' });
                    // ドローの場合はclearAfterAction()を呼ばない
                    renderUI();
                });
            } else if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    shuffleDeck(1, 'deck');
                    gameState.logs.push({ type: 'system', message: '1Pが山札をシャッフルしました', time: Date.now() });
                    clearAfterAction();
                    renderUI();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    gameState.handZoneMode = 'deck';
                    clearAfterAction();
                    renderUI();
                });
            }
            
            actionPanel.appendChild(btn);
        });
        return;
    }
    
    // 自分のEX
    if (source === 'ex') {
        const btn = document.createElement('button');
        btn.className = 'action-btn full-width';
        btn.textContent = '確認';
        btn.addEventListener('click', () => {
            gameState.handZoneMode = 'ex';
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(btn);
        return;
    }
    
    // 自分のカウンター
    if (source === 'counter') {
        const btn = document.createElement('button');
        btn.className = 'action-btn full-width';
        btn.textContent = 'カウンター発動';
        btn.disabled = !isMyTurn;
        btn.addEventListener('click', () => {
            if (gameState.players[1].field.counter) {
                gameState.logs.push({
                    type: '1P',
                    message: `${gameState.players[1].field.counter.card.cardName}をカウンター発動しました`,
                    time: Date.now()
                });
                gameState.players[1].graveyard.push(gameState.players[1].field.counter);
                gameState.players[1].field.counter = null;
                clearAfterAction();
                renderUI();
            }
        });
        actionPanel.appendChild(btn);
        return;
    }


    // 場のモンスター選択時
    if (source === 'field' && gameState.selectedFieldMonster) {
        const monster = gameState.selectedFieldMonster;
        const card = monster.card;
        
        const attackBtn = document.createElement('button');
        attackBtn.className = 'action-btn';
        attackBtn.textContent = '通常攻撃';
        attackBtn.disabled = !isMyTurn;
        attackBtn.addEventListener('click', () => {
            showTargetSelection('通常攻撃', (target) => {
                gameState.logs.push({
                    type: '1P',
                    message: `${card.cardName}で${target}に通常攻撃しました`,
                    time: Date.now()
                });
                clearAfterAction();
                renderUI();
            });
        });
        actionPanel.appendChild(attackBtn);
        
        if (card.skills && card.skills.some(s => s.type === 'A')) {
            const aSkills = card.skills.filter(s => s.type === 'A');
            aSkills.forEach(skill => {
                const skillBtn = document.createElement('button');
                skillBtn.className = 'action-btn';
                skillBtn.textContent = `Aスキル: ${skill.name}`;
                skillBtn.disabled = !isMyTurn;
                skillBtn.addEventListener('click', () => {
                    showTargetSelection(`Aスキル: ${skill.name}`, (target) => {
                        gameState.logs.push({
                            type: '1P',
                            message: `${card.cardName}のAスキル「${skill.name}」を${target}に発動しました`,
                            time: Date.now()
                        });
                        clearAfterAction();
                        renderUI();
                    });
                });
                actionPanel.appendChild(skillBtn);
            });
        }
        
        if (card.skills && card.skills.some(s => s.type === 'P')) {
            const pSkills = card.skills.filter(s => s.type === 'P');
            pSkills.forEach(skill => {
                const skillBtn = document.createElement('button');
                skillBtn.className = 'action-btn';
                skillBtn.textContent = `Pスキル: ${skill.name}`;
                skillBtn.disabled = !isMyTurn;
                skillBtn.addEventListener('click', () => {
                    gameState.logs.push({
                        type: '1P',
                        message: `${card.cardName}のPスキル「${skill.name}」を発動しました`,
                        time: Date.now()
                    });
                    clearAfterAction();
                    renderUI();
                });
                actionPanel.appendChild(skillBtn);
            });
        }
        
        const moveBtn = document.createElement('button');
        moveBtn.className = 'action-btn';
        moveBtn.textContent = '移動';
        moveBtn.disabled = !isMyTurn;
        moveBtn.addEventListener('click', () => {
            showPlacementPanel(-1, card, true);
        });
        actionPanel.appendChild(moveBtn);
        
        const toGraveyardBtn = document.createElement('button');
        toGraveyardBtn.className = 'action-btn';
        toGraveyardBtn.textContent = '墓地へ送る';
        toGraveyardBtn.disabled = !isMyTurn;
        toGraveyardBtn.addEventListener('click', () => {
            const pos = gameState.selectedFieldPosition;
            gameState.players[1].field[pos.zone][pos.index] = null;
            monster.currentDamage = 0;
            gameState.players[1].graveyard.push(monster);
            gameState.logs.push({
                type: 'system',
                message: `${card.cardName}を墓地に送りました`,
                time: Date.now()
            });
            gameState.selectedFieldMonster = null;
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(toGraveyardBtn);
        
        const toHandBtn = document.createElement('button');
        toHandBtn.className = 'action-btn';
        toHandBtn.textContent = '手札に加える';
        toHandBtn.disabled = !isMyTurn;
        toHandBtn.addEventListener('click', () => {
            const pos = gameState.selectedFieldPosition;
            gameState.players[1].field[pos.zone][pos.index] = null;
            monster.currentDamage = 0;
            gameState.players[1].hand.push(monster);
            gameState.logs.push({
                type: 'system',
                message: `${card.cardName}を手札に加えました`,
                time: Date.now()
            });
            gameState.selectedFieldMonster = null;
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(toHandBtn);
        
        const toFreeBtn = document.createElement('button');
        toFreeBtn.className = 'action-btn';
        toFreeBtn.textContent = 'フリーゾーンへ';
        toFreeBtn.disabled = !isMyTurn;
        toFreeBtn.addEventListener('click', () => {
            const pos = gameState.selectedFieldPosition;
            gameState.players[1].field[pos.zone][pos.index] = null;
            monster.currentDamage = 0;
            if (!gameState.players[1].free) gameState.players[1].free = [];
            gameState.players[1].free.push(monster);
            gameState.logs.push({
                type: 'system',
                message: `${card.cardName}をフリーゾーンに移動しました`,
                time: Date.now()
            });
            gameState.selectedFieldMonster = null;
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(toFreeBtn);
        
        const toDeckBtn = document.createElement('button');
        toDeckBtn.className = 'action-btn';
        toDeckBtn.textContent = 'デッキに戻す';
        toDeckBtn.disabled = !isMyTurn;
        toDeckBtn.addEventListener('click', () => {
            const pos = gameState.selectedFieldPosition;
            gameState.players[1].field[pos.zone][pos.index] = null;
            monster.currentDamage = 0;
            gameState.players[1].deck.push(monster);
            shuffleDeck(1);
            gameState.logs.push({
                type: 'system',
                message: `${card.cardName}をデッキに戻しました`,
                time: Date.now()
            });
            gameState.selectedFieldMonster = null;
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(toDeckBtn);
        
        const effectBtn = document.createElement('button');
        effectBtn.className = 'action-btn';
        effectBtn.textContent = '効果発動';
        effectBtn.disabled = !isMyTurn;
        effectBtn.addEventListener('click', () => {
            gameState.logs.push({
                type: '1P',
                message: `${card.cardName}の効果を発動しました`,
                time: Date.now()
            });
            clearAfterAction();
            renderUI();
        });
        actionPanel.appendChild(effectBtn);
        
        return;
    }

    if (source === 'mulligan') {
        if (gameState.mulliganPhase) {
            const btn = document.createElement('button');
            btn.className = 'action-btn full-width';
            btn.textContent = `デッキに戻す (${gameState.mulliganSelected.length}枚)`;
            btn.addEventListener('click', () => {
                executeAction({ type: 'MULLIGAN_RETURN' });
                clearAfterAction();
            });
            actionPanel.appendChild(btn);
        }
    } 
    else if (source === 'hand' && gameState.selectedCard && !gameState.mulliganPhase) {
        const index = gameState.players[1].hand.indexOf(gameState.selectedCard);
        
        if (index === -1) {
            gameState.selectedCard = null;
            gameState.selectedCardSource = null;
            return;
        }
        
        const card = gameState.selectedCard.card;
        
        const graveyardBtn = document.createElement('button');
        graveyardBtn.className = 'action-btn';
        graveyardBtn.textContent = '墓地に送る';
        graveyardBtn.disabled = !isMyTurn;
        graveyardBtn.addEventListener('click', () => {
            executeAction({ type: 'SEND_TO_GRAVEYARD', source: 'hand', index: index });
            clearAfterAction();
        });
        actionPanel.appendChild(graveyardBtn);
        
        const returnBtn = document.createElement('button');
        returnBtn.className = 'action-btn';
        returnBtn.textContent = 'デッキに戻す';
        returnBtn.disabled = !isMyTurn;
        returnBtn.addEventListener('click', () => {
            executeAction({ type: 'RETURN_TO_DECK', source: 'hand', index: index });
            clearAfterAction();
        });
        actionPanel.appendChild(returnBtn);
        
        const freeBtn = document.createElement('button');
        freeBtn.className = 'action-btn';
        freeBtn.textContent = 'フリーゾーンへ';
        freeBtn.disabled = !isMyTurn;
        freeBtn.addEventListener('click', () => {
            executeAction({ type: 'ADD_TO_FREE', source: 'hand', index: index });
            clearAfterAction();
        });
        actionPanel.appendChild(freeBtn);
        
        const effectBtn = document.createElement('button');
        effectBtn.className = 'action-btn';
        effectBtn.textContent = '効果発動';
        effectBtn.disabled = !isMyTurn;
        effectBtn.addEventListener('click', () => {
            executeAction({ type: 'ACTIVATE_EFFECT' });
            clearAfterAction();
        });
        actionPanel.appendChild(effectBtn);
        
        if (card.cardBase === 'monster') {
            if (card.monsterType === '通常' || card.monsterType === '特殊進化') {
                const placeBtn = document.createElement('button');
                placeBtn.className = 'action-btn';
                placeBtn.textContent = card.monsterType === '通常' ? '場に出す' : '場に出す(特殊進化)';
                placeBtn.disabled = !isMyTurn;
                placeBtn.addEventListener('click', () => {
                    showPlacementPanel(index, card);
                });
                actionPanel.appendChild(placeBtn);
                
                const info = document.createElement('div');
                info.style.fontSize = '0.8rem';
                info.style.color = 'var(--text-muted)';
                info.style.marginTop = '0.5rem';
                info.style.gridColumn = 'span 2';
                info.textContent = card.monsterType === '通常' 
                    ? '空いているセルに配置できます' 
                    : 'モンスターがいるセルに特殊進化できます';
                actionPanel.appendChild(info);
            }
        } else if (card.cardBase === 'magic') {
            const activateBtn = document.createElement('button');
            activateBtn.className = 'action-btn';
            const cost = card.magicCost || 0;
            activateBtn.textContent = `発動(コスト: ${cost})`;
            activateBtn.disabled = !isMyTurn || gameState.players[1].mana < cost;
            activateBtn.addEventListener('click', () => {
                executeAction({ type: 'ACTIVATE_MAGIC', source: 'hand', index: index });
                clearAfterAction();
            });
            actionPanel.appendChild(activateBtn);
            
            const setCounterBtn = document.createElement('button');
            setCounterBtn.className = 'action-btn';
            setCounterBtn.textContent = 'カウンターにセット';
            setCounterBtn.disabled = !isMyTurn || gameState.players[1].field.counter !== null;
            setCounterBtn.addEventListener('click', () => {
                executeAction({ type: 'SET_COUNTER', source: 'hand', index: index });
                clearAfterAction();
            });
            actionPanel.appendChild(setCounterBtn);
        } else if (card.cardBase === 'supporter') {
            const activateBtn = document.createElement('button');
            activateBtn.className = 'action-btn';
            activateBtn.textContent = '発動';
            activateBtn.disabled = !isMyTurn || gameState.usedSupporterThisTurn;
            activateBtn.addEventListener('click', () => {
                executeAction({ type: 'ACTIVATE_SUPPORTER', source: 'hand', index: index });
                clearAfterAction();
            });
            actionPanel.appendChild(activateBtn);
            
            if (gameState.usedSupporterThisTurn) {
                const info = document.createElement('div');
                info.style.fontSize = '0.8rem';
                info.style.color = 'var(--text-muted)';
                info.style.marginTop = '0.5rem';
                info.style.gridColumn = 'span 2';
                info.textContent = 'このターンは既にサポーターを使用しています';
                actionPanel.appendChild(info);
            }
        }
    }
    else if (source === 'graveyard') {
        const buttons = ['確認', 'シャッフル'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'SHUFFLE', zone: 'graveyard' });
                    clearAfterAction();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'VIEW_ZONE', zone: 'graveyard' });
                    clearAfterAction();
                });
            }
            
            actionPanel.appendChild(btn);
        });
    } else if (source === 'deck') {
        const buttons = ['確認', 'シャッフル', 'ドロー'];
        buttons.forEach(label => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.textContent = label;
            
            if (label === 'ドロー') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'DRAW' });
                    clearAfterAction();
                });
            } else if (label === 'シャッフル') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'SHUFFLE', zone: 'deck' });
                    clearAfterAction();
                });
            } else if (label === '確認') {
                btn.addEventListener('click', () => {
                    executeAction({ type: 'VIEW_ZONE', zone: 'deck' });
                    clearAfterAction();
                });
            }
            
            actionPanel.appendChild(btn);
        });
    } else if (source === 'ex') {
        const btn = document.createElement('button');
        btn.className = 'action-btn full-width';
        btn.textContent = '確認';
        btn.addEventListener('click', () => {
            executeAction({ type: 'VIEW_ZONE', zone: 'ex' });
            clearAfterAction();
        });
        actionPanel.appendChild(btn);
    } else if (source === 'counter') {
        const btn = document.createElement('button');
        btn.className = 'action-btn full-width';
        btn.textContent = 'カウンター発動';
        btn.disabled = !isMyTurn;
        btn.addEventListener('click', () => {
            if (gameState.players[1].field.counter) {
                gameState.logs.push({
                    type: '1P',
                    message: `${gameState.players[1].field.counter.card.cardName}をカウンター発動しました`,
                    time: Date.now()
                });
                gameState.players[1].graveyard.push(gameState.players[1].field.counter);
                gameState.players[1].field.counter = null;
                clearAfterAction();
                renderUI();
            }
        });
        actionPanel.appendChild(btn);
    }
    
    if (gameState.selectedCard && ['deck', 'graveyard', 'ex', 'free'].includes(source)) {
        const sourceKey = source === 'deck' ? 'deck' : source === 'graveyard' ? 'graveyard' : source === 'ex' ? 'ex' : 'free';
        const index = gameState.players[1][sourceKey].indexOf(gameState.selectedCard);
        
        if (index !== -1) {
            const addHandBtn = document.createElement('button');
            addHandBtn.className = 'action-btn';
            addHandBtn.textContent = '手札に加える';
            addHandBtn.disabled = !isMyTurn;
            addHandBtn.addEventListener('click', () => {
                executeAction({ type: 'ADD_TO_HAND', source: source, index: index });
                clearAfterAction();
            });
            actionPanel.appendChild(addHandBtn);
            
            const returnBtn = document.createElement('button');
            returnBtn.className = 'action-btn';
            returnBtn.textContent = 'デッキに戻す';
            returnBtn.disabled = !isMyTurn;
            returnBtn.addEventListener('click', () => {
                executeAction({ type: 'RETURN_TO_DECK', source: source, index: index });
                clearAfterAction();
            });
            actionPanel.appendChild(returnBtn);
            
            // フリーゾーンの場合は「フリーゾーンへ」ボタンを表示しない
            if (source !== 'deck' && source !== 'free') {
                const freeBtn = document.createElement('button');
                freeBtn.className = 'action-btn';
                freeBtn.textContent = 'フリーゾーンへ';
                freeBtn.disabled = !isMyTurn;
                freeBtn.addEventListener('click', () => {
                    executeAction({ type: 'ADD_TO_FREE', source: source, index: index });
                    clearAfterAction();
                });
                actionPanel.appendChild(freeBtn);
            }
            
            const effectBtn = document.createElement('button');
            effectBtn.className = 'action-btn';
            effectBtn.textContent = '効果発動';
            effectBtn.disabled = !isMyTurn;
            effectBtn.addEventListener('click', () => {
                executeAction({ type: 'ACTIVATE_EFFECT' });
                clearAfterAction();
            });
            actionPanel.appendChild(effectBtn);
            
            if (gameState.selectedCard.card.cardBase === 'monster' || gameState.selectedCard.card.cardBase === 'ex') {
                const placeBtn = document.createElement('button');
                placeBtn.className = 'action-btn';
                placeBtn.textContent = '場に出す';
                placeBtn.disabled = !isMyTurn;
                placeBtn.addEventListener('click', () => {
                    alert('場に出す機能は実装中です');
                });
                actionPanel.appendChild(placeBtn);
            }
        }
    }
}

// デッキを読み込む関数
function loadDeck(deckData) {
    gameState.players[1].deck = [];
    gameState.players[1].ex = [];
    gameState.players[1].hand = [];
    gameState.players[1].graveyard = [];
    gameState.players[1].free = [];
    
    if (deckData.main) {
        deckData.main.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                gameState.players[1].deck.push({
                    card: item.card,
                    currentDamage: 0
                });
            }
        });
    }
    
    if (deckData.ex) {
        deckData.ex.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                gameState.players[1].ex.push({
                    card: item.card,
                    currentDamage: 0
                });
            }
        });
    }
    
    shuffleDeck(1);
    
    gameState.mulliganPhase = true;
    gameState.mulliganSelected = [];
    executeAction({ type: 'INITIAL_DRAW' });
}



// 初期化
const savedDeckData = localStorage.getItem('battleDeck');
if (savedDeckData) {
    try {
        const deck = JSON.parse(savedDeckData);
        loadDeck(deck);
    } catch (error) {
        console.error('デッキ読み込みエラー:', error);
    }
}

// 相手の場を初期化（この行を追加）
initOpponentField();

renderUI();