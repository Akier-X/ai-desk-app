# GitHub Actions - 自動 Android ビルドセットアップ

このガイドでは、GitHub Actions を使用して Android アプリ（APK/AAB）を自動的にビルド・署名し、Google Play Store にアップロードする方法を説明します。

## 概要

`.github/workflows/android-build.yml` により、以下が自動化されます：

1. **タグをプッシュ** → `git tag v1.0.0` && `git push --tags`
2. **GitHub Actions が起動** → Next.js ビルド、Capacitor 同期、Android ビルド
3. **APK/AAB 生成** → GitHub Releases にアップロード
4. **Google Play に自動アップロード**（オプション）

---

## セットアップ手順

### 1. GitHub Secrets の設定

GitHub リポジトリの **Settings** → **Secrets and variables** → **Actions** に以下を追加：

#### キーストアの準備

1. ローカルマシンでキーストア（`.jks`）を生成（初回のみ）：

```bash
keytool -genkey -v -keystore release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias canvas-release

# パスワード等を入力
```

2. Base64 にエンコード：

```bash
# Windows
certutil -encodehex release-key.jks release-key.b64

# macOS/Linux
base64 -i release-key.jks -o release-key.b64
```

3. ファイルの内容をコピー

#### Secret として登録

以下を GitHub Secrets に追加：

| Name | Value |
|------|-------|
| `ANDROID_KEYSTORE_BASE64` | `release-key.b64` のファイル内容全体 |
| `ANDROID_KEYSTORE_PASSWORD` | キーストア生成時に設定したパスワード |
| `ANDROID_KEY_ALIAS` | `canvas-release` |
| `ANDROID_KEY_PASSWORD` | キー生成時のパスワード |

**オプション**（Google Play への自動アップロード時）：

| Name | Value |
|------|-------|
| `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` | Google Play Service Account の JSON（下記参照） |

---

### 2. Google Play Service Account のセットアップ（オプション）

Google Play Store への自動アップロードを有効にするには：

1. [Google Cloud Console](https://console.cloud.google.com/) に移動
2. **APIs & Services** → **Create Credentials** → **Service Account**
3. サービスアカウント を作成
4. **Keys** → **Add Key** → **JSON** でダウンロード
5. JSON の全内容を Secret `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` に登録

---

## ビルド・リリース手順

### ローカルでの手順

```bash
# 1. コードを完成させる
git add .
git commit -m "Prepare for v1.0.0 release"

# 2. バージョンタグを作成
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial Android release"

# 3. リモートにプッシュ（これで GitHub Actions が起動）
git push origin main
git push --tags
```

### GitHub Actions の実行確認

1. リポジトリの **Actions** タブを開く
2. **Android Build & Release** ワークフローを選択
3. 実行状況をリアルタイム監視

---

## ビルド成果物の入手

### 方法 1: GitHub Releases（自動）

タグをプッシュすると、自動的に Release が作成され、APK/AAB がアップロードされます。

```
https://github.com/your-repo/releases/tag/v1.0.0
```

### 方法 2: Artifacts

ワークフロー実行後、**Artifacts** セクションから直接ダウンロード可能：

- `app-release-apk` - APK ファイル
- `app-release-aab` - AAB ファイル（Google Play 推奨）

---

## Google Play Store へのマニュアルアップロード

Secrets 設定なしで Action を実行した場合、または手動でアップロードしたい場合：

1. [Google Play Console](https://play.google.com/console) にログイン
2. **Releases** → **Create new release**
3. **Upload** セクションで `app-release.aab` をアップロード
4. Release notes を入力
5. **Save** → **Review release** → **Start rollout**

---

## トラブルシューティング

### ビルド失敗: `Keystore was tampered with, or password was incorrect`

- Secret `ANDROID_KEYSTORE_BASE64` が正しく Base64 エンコードされているか確認
- パスワードが間違っていないか確認

```bash
# Secret の内容が正しいか確認する方法：
# 1. Base64 をデコード
echo "ANDROID_KEYSTORE_BASE64の内容" | base64 -d > test.jks

# 2. キーストアの情報を確認
keytool -list -v -keystore test.jks -storepass "ANDROID_KEYSTORE_PASSWORD"
```

### Google Play アップロード失敗: `Invalid request parameters`

- Service Account に適切な IAM ロール（例：Editor）が付与されているか確認
- JSON ファイルに `type: "service_account"` が含まれているか確認

### ビルドタイムアウト

GitHub Actions は無料プランでも月 2000 分まで利用可能。大規模ビルドの場合は `ubuntu-latest` を `ubuntu-20.04` に変更して試してください。

---

## 手動トリガー

タグなしでも手動でビルドをトリガーできます：

1. **Actions** タブ → **Android Build & Release**
2. **Run workflow** をクリック
3. ブランチを選択して実行

---

## 次のステップ

1. **テスト**: APK/AAB を Google Play Console の **Internal Testing** にアップロード
2. **ユーザーテスト**: テスター用リンクを配布
3. **フィードバック収集**: ユーザーからのフィードバックを元に改善
4. **本番リリース**: **Staged Rollout** で段階的に公開（例：初日 5%, 2日目 25%, 最終日 100%）

---

## 参考リンク

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gradle Build Guide](https://developer.android.com/build)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)

---

質問・問題がある場合は、Issues で報告してください！
