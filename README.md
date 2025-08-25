# ゆっくり解説風 掛け合いチャット
- ゆっくり解説風の掛け合いチャット、ユーザーは霊夢となって質問やコメントを行うと魔理沙がコメントを返してくれまず

<img width="1516" height="756" alt="サンプル画像" src="https://github.com/user-attachments/assets/de88d585-4d41-4fc6-80bf-a49951b6235e" />


## 特徴
* 解説機能 - ゆっくり解説でお馴染みの霊夢・魔理沙の掛け合いを再現
* タイプライター - リアルタイムの文字ごとの表示アニメーション
* サウンドエフェクト- Web Audio API を使用したタイピングサウンドの生成


## 要件
* Python 3.8 以上 
* pip (Python パッケージ マネージャー、通常は Python に含まれています)
* Google AI Studio API キー

# 開発情報

## 技術スタックと代表的なライブラリ
- フロントエンド: React / TypeScript / Next.js(app router)
- UI/スタイリング：Tailwind CSS
- 開発支援: Biome

## ディレクトリ構成
```
  chat-bot/
  ├── src/                        # ソースコード
      ├── app/                    # Next.js App Router
      │   ├── layout.tsx          # ルートレイアウト
      │   ├── page.tsx            # メインページ（チャット画面）
      │   ├── globals.css         # グローバルスタイル
      │   ├── favicon.ico         # ファビコン
      │   │
      │   └── api/                # API Routes
      │       └── gemini-api/
      │           └── route.ts    # エンドポイント
      │
      ├── components/             # Reactコンポーネント
      │   └── TypewriterMessage.tsx # タイプライター効果コンポーネント
      │
      └── hooks/                  # カスタムフック
          ├── useChatMessage.ts   # チャット機能管理
          ├── useTypewriter.ts    # タイプライター効果
          └── useTypeSound.ts     # ビープ音生成
```



