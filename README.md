# Twitter MCP Server

ClaudeでTwitter/Xの投稿文字数を正確にカウントし、投稿を最適化するためのMCP（Model Context Protocol）サーバです。

## 機能

- **正確な文字数カウント**: Twitter/Xの公式カウント方式に基づいて文字数を計算
- **投稿検証**: 文字数制限やその他の制約をチェック
- **投稿最適化**: 長すぎる投稿の最適化提案
- **エンティティ抽出**: URL、メンション、ハッシュタグの抽出と解析

## インストール

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd twitter-mcp-server

# 依存関係をインストール
npm install

# ビルド
npm run build
```

## Claude Desktopでの設定

Claude Desktopの設定ファイル（`~/Library/Application Support/Claude/claude_desktop_config.json`）に以下を追加：

```json
{
  "mcpServers": {
    "twitter-mcp-server": {
      "command": "node",
      "args": ["/path/to/twitter-mcp-server/dist/server.js"]
    }
  }
}
```

## 使用方法

Claude内で以下のツールが利用可能になります：

### 1. count_tweet_characters
```
Twitter/Xの投稿文字数を正確にカウントしてください:
「こんにちは！今日は良い天気ですね ☀️ #goodweather https://example.com」
```

### 2. validate_tweet
```
この投稿が有効かどうか検証してください:
「（長い投稿テキスト）」
```

### 3. optimize_tweet
```
この投稿を最適化してください:
「（最適化したい投稿テキスト）」
```

### 4. extract_entities
```
この投稿からエンティティを抽出してください:
「@user こんにちは！ #hello https://example.com を見てください」
```

## 開発

```bash
# 開発モードで起動
npm run dev

# ビルド
npm run build

# 本番環境で起動
npm start
```

## API詳細

### count_tweet_characters
- **入力**: `text` (string) - カウントしたいテキスト
- **出力**: 文字数、残り文字数、有効性などの詳細情報

### validate_tweet
- **入力**: `text` (string) - 検証したいテキスト
- **出力**: 有効性、問題点、エンティティ情報

### optimize_tweet
- **入力**: 
  - `text` (string) - 最適化したいテキスト
  - `maxLength` (number, optional) - 最大文字数（デフォルト: 280）
- **出力**: 最適化されたテキストと提案

### extract_entities
- **入力**: `text` (string) - エンティティを抽出したいテキスト
- **出力**: URL、メンション、ハッシュタグのリスト

## 技術スタック

- **TypeScript**: 型安全性とより良い開発体験
- **@modelcontextprotocol/sdk**: MCP サーバー実装
- **twitter-text**: Twitter公式の文字数カウントライブラリ

## ライセンス

MIT License

## 貢献

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## サポート

問題や質問がある場合は、GitHub Issuesで報告してください。
