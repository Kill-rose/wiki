// ui.js
// DOMヘルパーと基本的なメッセージ表示ロジック

function randomFloat(min, max) {
  if (max === undefined) { max = min; min = 0; }
  return Math.random() * (max - min) + min;
}
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function random(a, b) {
  if (a === undefined) return Math.random();
  if (Array.isArray(a)) return randomItem(a);
  if (b === undefined) return Math.random() * a;
  return randomFloat(a, b);
}
function floor(n) { return Math.floor(n); }
function constrain(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }
function max(...args) { return Math.max(...args); }
function min(...args) { return Math.min(...args); }

function el(tag, text) {
  let e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  return wrap(e);
}
function wrap(domEl) {
  let w = {
    elt: domEl,
    parent(p) {
      let target = p && p.elt ? p.elt : (typeof p === 'string' ? document.getElementById(p) : p);
      if (target) target.appendChild(domEl);
      return w;
    },
    id(s) { domEl.id = s; return w; },
    class(s) { domEl.className = s; return w; },
    addClass(s) { domEl.classList.add(s); return w; },
    removeClass(s) { domEl.classList.remove(s); return w; },
    html(s) { domEl.innerHTML = s; return w; },
    style(prop, val) {
      if (val === undefined) return domEl.style[prop];
      domEl.style[prop] = val; return w;
    },
    attribute(k, v) {
      if (v === null || v === undefined) domEl.removeAttribute(k);
      else domEl.setAttribute(k, v);
      return w;
    },
    value() { return domEl.value; },
    mousePressed(fn) { domEl.addEventListener('click', fn); return w; },
    mouseClicked(fn) {
      if (fn === null) return w;
      domEl.addEventListener('click', fn); return w;
    },
    remove() { if (domEl.parentNode) domEl.parentNode.removeChild(domEl); },
  };
  return w;
}
function createDiv(html) { let w = el('div'); if (html) w.html(html); return w; }
function createButton(label) { return el('button', label); }
function createElement(tag, text) { return el(tag, text); }
function createImg(src, alt) {
  let img = document.createElement('img');
  img.src = src; img.alt = alt || '';
  return wrap(img);
}
function select(selector) {
  let dom = document.querySelector(selector);
  return dom ? wrap(dom) : null;
}

let messageWaiting = false;
let nextAction = null;

function showMessage(msg, waitForClick = false, afterFunc = null) {
  textZone.html(msg);
  textZone.elt.removeEventListener('click', onMessageClick);
  if (waitForClick) {
    messageWaiting = true;
    nextAction = afterFunc;
    textZone.style('cursor', 'pointer');
    textZone.elt.addEventListener('click', onMessageClick);
    textZone.addClass('waiting');
    actionPanel.style('visibility', 'hidden');
  } else {
    messageWaiting = false;
    nextAction = null;
    textZone.style('cursor', 'default');
    textZone.removeClass('waiting');
    actionPanel.style('visibility', 'visible');
  }
}

function onMessageClick() {
  if (!messageWaiting) return;
  messageWaiting = false;
  textZone.style('cursor', 'default');
  textZone.elt.removeEventListener('click', onMessageClick);
  textZone.removeClass('waiting');
  actionPanel.style('visibility', 'visible');
  let action = nextAction;
  nextAction = null;
  if (typeof action === 'function') action();
}

function updateBgImage(place) {
  const bgMap = { '広場': 'hiroba', '森': 'mori', '洞窟': 'doukutu' };
  let fname = bgMap[place] || 'hiroba';
  leftTop.style('background-image', `url('${fname}.jpg')`);
  leftTop.style('background-size', 'cover');
  leftTop.style('background-position', 'center');
}

function showPortrait(who) {
  let fileMap = { kei: 's01.png', naoto: 's02.png' };
  let file = fileMap[who];
  if (!file) return;
  let existing = select('#portrait');
  if (existing) existing.remove();
  let img = createImg(file, who);
  img.id('portrait');
  img.parent(leftWindow);
  img.style('position', 'absolute');
  img.style('bottom', 'calc(40% + 10px)');
  img.style('left', '20px');
  img.style('height', '200px');
  img.style('width', 'auto');
  img.style('z-index', '15');
  img.style('pointer-events', 'none');
  img.style('opacity', '0');
  img.style('transition', 'opacity 0.3s');
  setTimeout(() => { img.style('opacity', '1'); }, 10);
}

function hidePortrait() {
  let p = select('#portrait');
  if (p) {
    p.style('opacity', '0');
    setTimeout(() => { if (select('#portrait')) select('#portrait').remove(); }, 300);
  }
}
