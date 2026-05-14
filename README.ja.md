# Mochi

MochiはWebAssemblyを開発するためのシンプルなプログラミング言語です。

## 特徴
- Mochiの文法はJavaScriptのサブセットです
- Mochiはハンガリアン記法で型を定義する静的型付け言語です
- MochiはWebAssemblyにコンパイルできます

## 使い方
```bash
$ deno run -A ../mochic.js geo3x3.mochi.js --wat --wasm
$ deno run -A simple_geo3x3_mochi_wasm.js
```

MochiのコードはJavaScriptとして実行することもできます:

```bash
$ deno run -A simple_geo3x3_mochi_js.js
```

## アプリケーション
- [MochiによるGeo3x3エンコード/デコード](https://github.com/taisukef/Geo3x3/blob/master/README.md#in-Mochi)

## Todo
- String および uint8[] のデータサポートの追加
- wat および wat.js のインポート/エクスポート
- ドキュメントの追加
- キャラクターの作成
- テストスイートの追加
- ソースマップの追加

## ライセンス
MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
