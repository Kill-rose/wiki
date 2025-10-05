
document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    fetch('parts/sidebar.html')
      .then(res => res.text())
      .then(html => {
        sidebar.innerHTML = html;
      })
      .catch(err => console.error('サイドバーの読み込みに失敗しました:', err));
  }
});