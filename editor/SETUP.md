# 🚀 Lunetra Wiki Editor - セットアップガイド

このエディタは GitHub Pages で公開している **wiki フォルダ内のファイルをスマホから直接編集** できるツールです。

## 📋 必要な環境

- **Node.js** (v12 以上推奨) - [ダウンロード](https://nodejs.org/)
- **npm** (Node.js に付属)
- Windows PC

## 🔧 セットアップ

### 1️⃣ 依存パッケージをインストール

サイトフォルダ内で、ターミナルを開いて実行：

```bash
npm install
```

出力例：
```
added 123 packages in 12s
```

### 2️⃣ サーバーを起動

```bash
npm start
```

または：

```bash
node server.js
```

成功時の出力：
```
========================================
🚀 Lunetra Wiki Editor サーバー起動
========================================
ポート: 3000
Wiki フォルダ: C:\Users\shenm\Documents\サイト\wiki

📱 アクセス方法：
  - ローカル: http://localhost:3000
  - 同じネットワーク: http://<このPC のIP>:3000

⚠️  API トークン: your-secret-token-change-me
   変更するには: API_TOKEN="new-token" npm start

========================================
```

## 💻 ローカルから使用

1. **PC のブラウザ** を開く
2. `http://localhost:3000` にアクセス
3. エディタが表示されます

## 📱 スマホから使用（同じ WiFi 内）

### PC のIP アドレスを確認

**Windows では:**

ターミナル（PowerShell）で以下を実行：

```bash
ipconfig
```

出力から、`IPv4 アドレス` を探します（例: `192.168.1.100`）

```
イーサネット アダプター ...
   IPv4 アドレス...................: 192.168.1.100
   サブネット マスク...............: 255.255.255.0
   ...
```

### スマホでアクセス

スマホが **PC と同じ WiFi に接続** している状態で：

1. スマホのブラウザを開く
2. `http://<PC の IPv4 アドレス>:3000` を入力
   - 例: `http://192.168.1.100:3000`

## 🔐 セキュリティ（外部からのアクセス）

外出先など別のネットワークからアクセスしたい場合：

### 方法1: トンネルサービスを使用（推奨）

**ngrok** を使用した例：

```bash
npm install -g ngrok
ngrok http 3000
```

出力の `Forwarding` URL を使用します（例: `https://abc123.ngrok.io`）

### 方法2: API トークンを変更

より安全にするため、API トークンを強固にします：

```bash
API_TOKEN="your-very-secure-token-12345" npm start
```

エディタの⚙️ボタン → `API トークン` に同じ値を入力

## 📝 ファイル編集の流れ

1. **ローカル編集**：エディタから直接 `wiki/` フォルダ内のファイルを編集
2. **自動保存**：「保存」ボタンをクリックで、サーバー経由で wiki フォルダに反映
3. **GitHub にプッシュ**：変更をコミット＆プッシュして GitHub Pages に反映

## ⚠️ 注意事項

- **wiki/ 直下の .html ファイルのみ** 対応（サブフォルダ内のファイルは未対応）
- **index.html は編集対象外**（サイドバー読み込み用）
- ファイルを削除する場合は、GitHub リポジトリからも削除してください
- AP:I トークンは `server.js` と同じ値を設定してください

## 🆘 トラブルシューティング

### ❌ "サーバーに接続できません" メッセージ

- サーバーが起動しているか確認（ターミナルに `🚀 Lunetra Wiki Editor サーバー起動` と表示されているか）
- ファイアウォール設定を確認

### ❌ スマホからアクセスできない

- PC とスマホが **同じ WiFi に接続** しているか確認
- PC の IP アドレスが正しいか確認（`ipconfig` で確認）
- ポート番号 `3000` が開いているか確認

### ❌ ファイルが保存されない

- API トークンが正しいか確認（⚙️ボタン → 設定）
- wiki フォルダへの書き込み権限があるか確認
- ローカルストレージに一度は保存される（フォールバック機能）

## 📊 API リファレンス

### 認証

すべてのエンドポイントには `X-API-Token` ヘッダー または `token` クエリパラメータが必要：

```
X-API-Token: your-secret-token
```

### エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------|------|
| GET | `/api/files` | ファイル一覧を取得 |
| GET | `/api/files/:filename` | ファイル内容を取得 |
| POST | `/api/files/:filename` | ファイルを保存 |
| POST | `/api/create` | 新規ファイル作成 |
| DELETE | `/api/files/:filename` | ファイル削除 |
| GET | `/api/health` | ヘルスチェック |

## 🎯 使用例

### JavaScript での API 呼び出し

```javascript
const API_URL = 'http://localhost:3000/api';
const API_TOKEN = 'your-secret-token';

// ファイル一覧を取得
fetch(`${API_URL}/files?token=${API_TOKEN}`)
  .then(r => r.json())
  .then(files => console.log(files));

// ファイルを保存
fetch(`${API_URL}/files/mypage.html`, {
  method: 'POST',
  headers: {
    'X-API-Token': API_TOKEN,
    'Content-Type': 'text/plain'
  },
  body: '<h1>Hello</h1>'
})
.then(r => r.json())
.then(result => console.log(result));
```

## 📞 サポート

問題が発生した場合は、ターミナルのエラー出力を確認してください。

---

**Happy Editing! 📝**
