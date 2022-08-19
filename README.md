# nsfw-filter-bot

NSFWチャンネル以外に投稿された性的な画像を削除するボットです。結構遅いけどほぼ確実に削除してくれる。

# 本家からの変更内容
- Discord.js v14対応
- 各種ライブラリのアップグレードを実施

# 起動方法
- 1. `npm i` で依存関係パッケージをインストールする
- 2. `config.js` を作成し以下の内容を記述
```js
exports.TOKEN = 'YourTokenHere'
```
- 3. `node index.js` で起動

# 検証環境
MacBook Air (M2, 2022)<br>
macOS Monterey 12.5.1<br>
Node v18.7.0 (arm64)