# Mochi

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

Mochi is a simple programming language for developing WebAssembly.

## Features
- Mochi's grammar is a subset of JavaScript
- Mochi is a statically-typed language that defines types in Hungarian notation
- Mochi can be compiled to WebAssembly

## Usage
```bash
$ deno run -A ../mochic.js geo3x3.mochi.js --wat --wasm
$ deno run -A simple_geo3x3_mochi_wasm.js
```

Mochi code can also be run as JavaScript:

```bash
$ deno run -A simple_geo3x3_mochi_js.js
```

## Applications
- [Geo3x3 encode/decode in Mochi](https://github.com/taisukef/Geo3x3/blob/master/README.md#in-Mochi)

## Todo
- add data support for String & uint8[]
- import/export wat & wat.js
- add docs
- make character
- add test suite
- add sourcemap

## License
MIT License — see [LICENSE](LICENSE).