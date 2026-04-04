const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { spawnSync } = require('child_process');

const app = express();
const REPO_ROOT = process.env.REPO_ROOT || __dirname;
const GIT_REMOTE = process.env.GIT_REMOTE || 'origin';
const GIT_BRANCH = process.env.GIT_BRANCH || 'main';
const PORT = process.env.PORT || 3000;

// wiki フォルダのパス
const WIKI_FOLDER = path.join(__dirname, 'wiki');
const API_TOKEN = process.env.API_TOKEN || 'your-secret-token-change-me';

// ミドルウェア設定
app.use(cors());
app.use(bodyParser.text({ limit: '50mb' }));
app.use(bodyParser.json());

// 静的ファイル配信（フロントエンド用）
app.use(express.static(__dirname));

// ルートパスでエディタを表示
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'lunetra-wiki-editor.html'));
});

// トークン認証ミドルウェア
const authenticate = (req, res, next) => {
  const token = req.headers['x-api-token'] || req.query.token;
  
  if (!token || token !== API_TOKEN) {
    return res.status(401).json({ error: '認証が必要です' });
  }
  
  next();
};

const runGit = (args) => {
  const result = spawnSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8'
  });
  return result;
};

const isGitRepo = () => {
  const result = runGit(['rev-parse', '--is-inside-work-tree']);
  return result.status === 0 && result.stdout.trim() === 'true';
};

// ========== API エンドポイント ==========

// ファイル一覧を取得（wiki/ 直下の .html ファイルのみ）
app.get('/api/files', authenticate, (req, res) => {
  try {
    const files = fs.readdirSync(WIKI_FOLDER)
      .filter(file => file.endsWith('.html') && file !== 'index.html')
      .map(file => {
        const filePath = path.join(WIKI_FOLDER, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          modifiedAt: stats.mtime.toISOString(),
          size: stats.size
        };
      });
    
    res.json(files);
  } catch (error) {
    console.error('ファイル一覧取得エラー:', error);
    res.status(500).json({ error: 'ファイル一覧の取得に失敗しました' });
  }
});

// 特定ファイルの内容を取得
app.get('/api/files/:filename', authenticate, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // セキュリティ: ディレクトリトラバーサル対策
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: '無効なファイル名です' });
    }
    
    const filePath = path.join(WIKI_FOLDER, filename);
    
    // wiki フォルダ内のファイルか確認
    if (!filePath.startsWith(WIKI_FOLDER)) {
      return res.status(403).json({ error: 'アクセスが拒否されました' });
    }
    
    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ファイルが見つかりません' });
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ name: filename, content });
  } catch (error) {
    console.error('ファイル読込エラー:', error);
    res.status(500).json({ error: 'ファイルの読込に失敗しました' });
  }
});

// ファイルを保存
app.post('/api/files/:filename', authenticate, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // セキュリティチェック
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: '無効なファイル名です' });
    }
    
    const filePath = path.join(WIKI_FOLDER, filename);
    
    if (!filePath.startsWith(WIKI_FOLDER)) {
      return res.status(403).json({ error: 'アクセスが拒否されました' });
    }
    
    // ファイル名が .html で終わるか確認
    if (!filename.endsWith('.html')) {
      return res.status(400).json({ error: '.html ファイルのみ対応しています' });
    }
    
    const content = req.body;
    fs.writeFileSync(filePath, content, 'utf-8');
    
    res.json({ 
      message: 'ファイルを保存しました',
      name: filename,
      modifiedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('ファイル保存エラー:', error);
    res.status(500).json({ error: 'ファイルの保存に失敗しました' });
  }
});

// 新規ファイル作成
app.post('/api/create', authenticate, (req, res) => {
  try {
    const { filename, content } = req.body;
    
    if (!filename || !content) {
      return res.status(400).json({ error: 'filename と content は必須です' });
    }
    
    // セキュリティチェック
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: '無効なファイル名です' });
    }
    
    if (!filename.endsWith('.html')) {
      return res.status(400).json({ error: '.html ファイルのみ対応しています' });
    }
    
    const filePath = path.join(WIKI_FOLDER, filename);
    
    if (!filePath.startsWith(WIKI_FOLDER)) {
      return res.status(403).json({ error: 'アクセスが拒否されました' });
    }
    
    // ファイルが既に存在するか確認
    if (fs.existsSync(filePath)) {
      return res.status(409).json({ error: 'ファイルが既に存在します' });
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    
    res.json({
      message: 'ファイルを作成しました',
      name: filename,
      modifiedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('ファイル作成エラー:', error);
    res.status(500).json({ error: 'ファイルの作成に失敗しました' });
  }
});

// ファイル削除
app.delete('/api/files/:filename', authenticate, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // セキュリティチェック
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: '無効なファイル名です' });
    }
    
    const filePath = path.join(WIKI_FOLDER, filename);
    
    if (!filePath.startsWith(WIKI_FOLDER)) {
      return res.status(403).json({ error: 'アクセスが拒否されました' });
    }
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'ファイルが見つかりません' });
    }
    
    fs.unlinkSync(filePath);
    
    res.json({ message: 'ファイルを削除しました' });
  } catch (error) {
    console.error('ファイル削除エラー:', error);
    res.status(500).json({ error: 'ファイルの削除に失敗しました' });
  }
});

// Gitプッシュ
app.post('/api/git-push', authenticate, (req, res) => {
  try {
    if (!isGitRepo()) {
      return res.status(400).json({ error: 'このフォルダーはGitリポジトリではありません' });
    }

    const message = req.body.message || 'Wiki update via editor';
    const statusResult = runGit(['status', '--porcelain']);

    if (statusResult.error) {
      throw statusResult.error;
    }

    const hasChanges = statusResult.stdout.trim().length > 0;
    let commitMessage = '';

    if (hasChanges) {
      const addResult = runGit(['add', '-A']);
      if (addResult.status !== 0) {
        throw new Error(addResult.stderr || 'git add failed');
      }

      const commitResult = runGit(['commit', '-m', message]);
      if (commitResult.status !== 0) {
        const stderr = commitResult.stderr || '';
        if (stderr.includes('nothing to commit')) {
          // no changes after all
        } else {
          throw new Error(stderr.trim() || 'git commit failed');
        }
      } else {
        commitMessage = commitResult.stdout.trim();
      }
    }

    const pushResult = runGit(['push', GIT_REMOTE, GIT_BRANCH]);
    if (pushResult.status !== 0) {
      const stderr = pushResult.stderr.trim();
      const stdout = pushResult.stdout.trim();
      throw new Error(stderr || stdout || 'git push failed');
    }

    res.json({
      message: 'Git push が完了しました',
      committed: hasChanges,
      commitOutput: commitMessage,
      pushOutput: pushResult.stdout.trim()
    });
  } catch (error) {
    console.error('Git push エラー:', error);
    res.status(500).json({ error: typeof error === 'string' ? error : error.message || 'Git push に失敗しました' });
  }
});

// サイドバーに更新日を追加
app.post('/api/update-sidebar', authenticate, (req, res) => {
  try {
    const { filename, title } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'filename は必須です' });
    }
    
    // タイトルが指定されていない場合はファイル名から拡張子を除いたものをタイトルに
    const displayTitle = title || filename.replace('.html', '');
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD形式
    
    const sidebarPath = path.join(WIKI_FOLDER, 'parts', 'sidebar.html');
    
    if (!fs.existsSync(sidebarPath)) {
      return res.status(404).json({ error: 'sidebar.html が見つかりません' });
    }
    
    let sidebarContent = fs.readFileSync(sidebarPath, 'utf-8');
    
    // 「最近の更新」セクションを探す
    const recentUpdatesMatch = sidebarContent.match(/(<div class="callout">\s*<span class="icon"><\/span>\s*<strong>最近の更新<\/strong>\s*<\/div>\s*<ul class="menu-list">)/);
    
    if (!recentUpdatesMatch) {
      return res.status(400).json({ error: '「最近の更新」セクションが見つかりません' });
    }
    
    const recentUpdatesSection = recentUpdatesMatch[1];
    
    // 今日の日付のエントリがあるか確認
    const todayEntryPattern = new RegExp(`<li>\\s*<details close>\\s*<summary>${dateStr.replace(/-/g, '\\-')}</summary>`, 'g');
    const hasTodayEntry = todayEntryPattern.test(sidebarContent);
    
    let newEntry;
    
    if (hasTodayEntry) {
      // 今日の日付のエントリがある場合、submenuに追加
      const todayEntryMatch = sidebarContent.match(new RegExp(`(<li>\\s*<details close>\\s*<summary>${dateStr.replace(/-/g, '\\-')}</summary>\\s*<ul class="submenu">[^]*?</ul>\\s*</details>\\s*</li>)`, 'g'));
      
      if (todayEntryMatch) {
        const todayEntry = todayEntryMatch[0];
        const updatedEntry = todayEntry.replace(
          /(<\/ul>\s*<\/details>\s*<\/li>)/,
          `                    <li><a href="${filename}">${displayTitle}</a></li>\n                $1`
        );
        sidebarContent = sidebarContent.replace(todayEntry, updatedEntry);
      } else {
        // 今日の日付のエントリが見つからない場合（予期せぬエラー）
        return res.status(500).json({ error: '今日の日付のエントリが見つかりません' });
      }
    } else {
      // 今日の日付のエントリがない場合、新しく作成
      newEntry = `        <li>
            <details close>
                <summary>${dateStr}</summary>
                <ul class="submenu">
                    <li><a href="${filename}">${displayTitle}</a></li>
                </ul>
            </details>
        </li>
${recentUpdatesSection.replace('<ul class="menu-list">', '<ul class="menu-list">\n')}`;
      
      sidebarContent = sidebarContent.replace(recentUpdatesSection, newEntry);
    }
    
    // ファイルを保存
    fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8');
    
    res.json({ 
      message: 'サイドバーを更新しました',
      date: dateStr,
      filename: filename,
      title: displayTitle
    });
  } catch (error) {
    console.error('サイドバー更新エラー:', error);
    res.status(500).json({ error: 'サイドバーの更新に失敗しました' });
  }
});

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    wikiFolder: WIKI_FOLDER,
    timestamp: new Date().toISOString()
  });
});

// 未定義APIエンドポイントのJSON応答
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'APIエンドポイントが見つかりません' });
});

// サーバー起動
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`🚀 Lunetra Wiki Editor サーバー起動`);
  console.log(`========================================`);
  console.log(`ポート: ${PORT}`);
  console.log(`Wiki フォルダ: ${WIKI_FOLDER}`);
  console.log(`\n📱 アクセス方法：`);
  console.log(`  - ローカル: http://localhost:${PORT}`);
  console.log(`  - 同じネットワーク: http://<このPC のIP>:${PORT}`);
  console.log(`\n⚠️  API トークン: ${API_TOKEN}`);
  console.log(`   変更するには: API_TOKEN="new-token" npm start\n`);
  console.log(`========================================\n`);
});
