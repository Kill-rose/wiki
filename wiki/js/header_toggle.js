// ページ読み込み時に状態を復元
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (!header || !toggleBtn) return;

    // 保存された状態を復元
    const headerState = localStorage.getItem('headerState');
    if (headerState === 'closed') {
        header.classList.add('closed');
        toggleBtn.textContent = '▼';
        toggleBtn.setAttribute('aria-label', 'ヘッダーを開く');
    }

    // ボタンクリックで開閉
    toggleBtn.addEventListener('click', () => {
        header.classList.toggle('closed');
        
        if (header.classList.contains('closed')) {
            toggleBtn.textContent = '▼';
            toggleBtn.setAttribute('aria-label', 'ヘッダーを開く');
            localStorage.setItem('headerState', 'closed');
        } else {
            toggleBtn.textContent = '▲';
            toggleBtn.setAttribute('aria-label', 'ヘッダーを閉じる');
            localStorage.setItem('headerState', 'open');
        }
    });
});