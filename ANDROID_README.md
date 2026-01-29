# Android Development Guide - Canvas App

このドキュメントは、Canvas アプリを Windows/Linux 環境から Google Play Store にリリースするための完全なガイドです。

## 目次

1. [環境セットアップ](#環境セットアップ)
2. [Adaptive Icons の設定](#adaptive-icons-の設定)
3. [ローカルビルド](#ローカルビルド)
4. [リリースビルド](#リリースビルド)
5. [Google Play Console への登録](#google-play-console-への登録)
6. [App Store へのアップロード](#app-store-へのアップロード)

---

## 環境セットアップ

### 必要なソフトウェア

1. **Android Studio** (Windows/Linux)
   - [Download Android Studio](https://developer.android.com/studio)
   - インストール時に Android SDK、Android 14 API、Build Tools を選択

2. **Java Development Kit (JDK)**
   ```bash
   # Windows: Environment Variables で JAVA_HOME を設定
   # Linux:
   sudo apt-get install openjdk-17-jdk
   ```

3. **Node.js & npm** (既にセットアップ済み)

### Capacitor Android の初期化

```bash
# プロジェクトディレクトリで実行
npm run build    # Next.js をビルド

# Android プラットフォームを追加
npx cap add android

# Android Studio で開く
npx cap open android
```

---

## Adaptive Icons の設定

Android 8.0 以降では、**Adaptive Icons** が必須です。これは以下の 2 つのレイヤーで構成されます：

- **Background**: 単色の背景（円形にマスクされる）
- **Foreground**: ロゴやテキスト（中央にマスクされる）

### 1. アイコンの準備

`public/` ディレクトリに以下のファイルを配置してください：

```
public/
├── icon-192.png          # 通常のアイコン (192x192)
├── icon-512.png          # 通常のアイコン (512x512)
├── icon-192-maskable.png # Maskable アイコン (192x192)
├── icon-512-maskable.png # Maskable アイコン (512x512)
├── adaptive-icon-bg.png  # 背景レイヤー (192x192)
└── adaptive-icon-fg.png  # フォアグラウンド (192x192)
```

### 2. Adaptive Icon のデザイン仕様

**サイズ**: 192x192 px（最小、推奨は 256x256）

**背景レイヤー** (`adaptive-icon-bg.png`):
- 単色の背景（例：`#3b82f6` ブルー）
- または簡単なグラデーション

**フォアグラウンド** (`adaptive-icon-fg.png`):
- ロゴは中央 72x72 px 内に配置
- 透明な背景を持つ PNG

### 3. Android Studio で設定

1. Android Studio を開く：
   ```bash
   npx cap open android
   ```

2. プロジェクトツリーで `android/app/src/main/res` を右クリック
   → **New** → **Image Asset**

3. **Asset Type** を `Adaptive Icon` に設定

4. **Foreground**, **Background**, **Monochrome** タブで画像を選択

5. **Next** → **Finish** をクリック

これにより `mipmap-*` ディレクトリに自動生成されます。

---

## ローカルビルド

### エミュレーターでのテスト

```bash
# 1. Next.js をビルド・エクスポート
npm run build

# 2. Capacitor を同期
npx cap sync android

# 3. Android Studio で開く
npx cap open android

# 4. Android Studio 内で：
#    - 左上の「Run」ボタン または
#    - Shift + F10 を押す

# 5. エミュレーターを選択して実行
```

### 実機でのテスト

```bash
# USB 接続後、同じく npx cap open android
# Run ボタンで実機にインストール
```

---

## リリースビルド

### 1. Signing Key（キーストア）の生成

```bash
cd android/app

# 初回のみ実行（リリースキーを生成）
keytool -genkey -v -keystore release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias canvas-release

# プロンプトで以下を入力：
# - Keystore Password: (強いパスワード)
# - Key Password: (同じパスワード)
# - First and Last Name: Canvas App
# - Organization: Your Name
# その他は Enter でスキップ

cd ../..
```

### 2. `android/app/build.gradle` に署名設定を追加

```gradle
android {
  ...
  signingConfigs {
    release {
      keyAlias 'canvas-release'
      keyPassword 'YOUR_KEY_PASSWORD'
      storeFile file('release-key.jks')
      storePassword 'YOUR_KEYSTORE_PASSWORD'
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
  }
}
```

### 3. リリース APK をビルド

Android Studio で：

1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. ビルド完了後、パスが表示される：
   ```
   android/app/release/app-release.apk
   ```

または CLI でも可能：

```bash
cd android
./gradlew assembleRelease
# 出力: app/build/outputs/apk/release/app-release.apk
```

### 4. リリース AAB をビルド（推奨）

Google Play は AAB（Android App Bundle）形式を推奨しています。

```bash
cd android
./gradlew bundleRelease
# 出力: app/build/outputs/bundle/release/app-release.aab
```

---

## Google Play Console への登録

### 1. 開発者アカウント登録

- [Google Play Console](https://play.google.com/console)
- **25 ドル（約 4,000 円）** で一度のみ（年間更新料なし）

### 2. アプリを作成

1. **Create app** をクリック
2. **Default Language**: Japanese または English
3. **App name**: Canvas
4. **App Category**: Productivity
5. **Default Category**: Lifestyle

### 3. ストアリスティングを入力

- **App Title**: Canvas - Design Your Perfect Desk
- **Short Description**: (80 文字以内)
- **Full Description**: (4000 文字以内)
- **Screenshots**: 5-8 枚（1080x1920 推奨）
- **Feature Graphic**: 1024x500 px

### 4. コンテンツ評価を入力

- Privacy Policy URL を入力（必須）
- COPPA（子供向け）: いいえ

### 5. リリース設定

**Testing** → **Open Testing** で、テスター向けに先行リリース可能

---

## App Store へのアップロード

### 1. AAB ファイルをアップロード

1. **Release** → **Create new release**
2. **Production** タブで **Create release** をクリック
3. **Add APK or AAB**:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```
   をドラッグ＆ドロップ

4. **Release notes** を入力（必須）:
   ```
   Version 1.0.0

   - AI-powered desk gadget recommendations
   - Canvas-based design interface
   - Seamless save and share functionality
   ```

5. **Save** → **Review release** → **Start rollout to Production**

### 2. 審査を待つ

- 通常 1-3 時間（初回は 24 時間の場合もあります）
- [Google Play Console](https://play.google.com/console) で進捗確認

---

## GitHub Actions での自動ビルド（オプション）

`.github/workflows/android-build.yml` を設定すれば、Git にプッシュするだけで自動的に APK/AAB を生成できます。

詳しくは [GitHub Actions Guide](./GITHUB_ACTIONS.md) を参照。

---

## トラブルシューティング

### `keytool` コマンドが見つからない

```bash
# Windows: Java のパスを確認
echo %JAVA_HOME%

# Linux: Java をインストール
sudo apt-get install default-jdk
```

### ビルド失敗: `Gradle sync failed`

```bash
# Gradle キャッシュをクリア
cd android
./gradlew clean

# 再度ビルド
./gradlew bundleRelease
```

### Android Studio で Capacitor プロジェクトが見つからない

```bash
npx cap sync android
npx cap open android
```

---

## 参考リンク

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

## 質問・問題がある場合

GitHub Issues で報告するか、プロジェクトオーナーに連絡してください。

Happy building! 🚀
