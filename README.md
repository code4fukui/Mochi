# Mochi lang

Mochi is a simple programming language to make WebAssembly.  
Mochi（もち）は、WebAssembly作成用のシンプルなプログラミング言語です。  

Mochi's grammer is subset of JavaScript.  
Mochiの文法はJavaScriptのサブセットになっています。

Mochi is stil poor.  
Mochiはまだまだ貧弱です。  

## sample

### sum.mochi

```JavaScript
import "./main.watx";

function main() {
  let sum, i;
  sum = 0;
  for (i = 1; i <= 100; i++) {
    sum += i;
  }
  return sum;
}
```

```bash
$ cd example
$ deno run -A ../mochic.js sum.mochi
$ deno run -A ../mochic.js sum.wat
```

### wasitest.mochi

```JavaScript
import "./wasi.watx";

function test(a, b) {
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
  printlni32(test(2, 4));
}
```

```bash
$ cd example
$ deno run -A ../mochic.js wasitest.mochi
$ wasmer wasitest.wat
```

## todo

- support array for String
- make [Geo3x3](https://geo3x3.com/)
- support [WASM-4](https://wasm4.org/)
- change the base JavaScript to TypeScript for types
