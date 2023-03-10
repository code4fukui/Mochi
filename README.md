# Mochi lang
![mochi-thin](https://user-images.githubusercontent.com/1715217/210369359-4e8f8c9f-b1b2-457e-baaf-f76905ec5378.png)

Mochi is a simple programming language to develop WebAssembly.  
Mochi（もち）は、WebAssembly開発用のシンプルなプログラミング言語です。  

Mochi grammer is a subset of JavaScript.  
Mochiの文法はJavaScriptのサブセットになっています。  

Mochi is a statically-typed language that defines types in Hungarian notation.  
Mochiは、ハンガリアン記法で型を定義する静的型付け言語です。  

Mochi is stil poor.  
Mochiは、まだまだ貧弱です。  

## example

### geo3x3.mochi.js

```JavaScript
const { i_encode, i_decode, memory } = await importWASM("./geo3x3.wasm");

const pccode = 0;
const res = i_encode(35.65858, 139.745433, 14, pccode);
const pccodemem = new Uint8Array(memory.buffer, 0, 14);
const code = new TextDecoder().decode(pccodemem);
console.log(res, code);
```

```bash
$ deno run -A ../mochic.js geo3x3.mochi.js --wat --wasm
$ deno run -A simple_geo3x3_mochi_wasm.js
```

also runs as JavaScript!

```JavaScript
import { i_encode, i_decode } from "./geo3x3.mochi.js";

const pccode = new Uint8Array(15);
const res = i_encode(35.65858, 139.745433, 14, pccode);
console.log(res, pc2s(pccode));
```

```bash
$ deno run -A simple_geo3x3_mochi_js.js
```

### sum.mochi.js

```JavaScript
export function _start() {
  let isum, i;
  isum = 0;
  for (i = 1; i <= 100; i++) {
    isum += i;
  }
  return isum;
}
```

```bash
$ deno run -A ../mochic.js sum.mochi.js --wat
$ deno run -A ../mochic.js sum.wat
```

### wasicalc.mochi.js for WASI

```JavaScript
function i_test(a, b) {
  let i, j;
  for (i = 0; i < b; i++) {
    for (j = 0; j < b; j++) {
      a += a;
    }
  }
  return a;
}
function _start() {
  printlni32(12345);
  printlni32(i_test(2, 4));
}
```

```bash
$ deno run -A ../mochic.js wasicalc.mochi.js --wasi --wat
$ wasmer wasicalc.wat
```

### wasm4simple.mochi.js for WASM-4

[wasm4simple.mochi.js](example/wasm4simple.mochi.js)
```JavaScript
const ps_DRAW_COLORS = 0x14;
let icnt = 0;
export function start() {
}
export function update() {
  ps_DRAW_COLORS[0] = 0x42
  line(0, 0, icnt, 159);
  icnt = (icnt + 1) % 160;
}
```

```bash
$ deno run -A ../mochic.js wasm4simple.mochi.js --wasm --wat --wasm4
$ w4 run wasm4simple.wasm
```

## application

- [Geo3x3 encode/decode in Mochi](https://github.com/taisukef/Geo3x3/blob/master/README.md#in-Mochi)

## todo

- add data support for String & uint8[]
- import/export wat & wat.js
- add docs
- make character
- add test suite
- add sourcemap (seeAlso [WebAssemblyでもブラウザでステップ実行ができるようになってたので寄り道しながら頑張った話 - Qiita](https://qiita.com/lempiji/items/462cce79dab8166fa5a5))
