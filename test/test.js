import { Mochi } from "../Mochi.js";

//const f = "a=(a+3)*b;a++;";
//const f = "a=='0'";
//const f = "len+=n";
//const f = "len--";
//const f = "a=i32len(30, 3+8);b++";
//const f = "if (a==261) { a++;} else a--";
//const f = "while (true) { break; a+=a; b--; }";
//const f = "for (b = 0; b < 16; b++) { a+=a; if (b == 8) break;}";
//const f = "let b, c; let a;b=0";
//const f = "function test(a, b) {a + b; }";
/*
const f = `function test(a, b) {
  let i;
  for (i = 0; i < b; i++) {
    a += a;
  }
  return a;
}`;
*/
/*
const f = `function test(a, b) {
  let i, j;
  for (i = 0; i < b; i++) {
    for (j = 0; j < b; j++) {
      a += a;
    }
  }
  return a;
}
function _start() {
  return test(2, 4);
}`;
*/
//const f = `import "./wasi-runtime.watx";`;
/*
const f = `import "../example/wasi.watx";

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
}`;
*/
//const f = "export function _start() {};"; // wasmer/wasmtime ok!
//const f = "function _start() {};"; // wasmer NG
//const f = "pc[0]=3;pi[4]=10";
//const f = "v=3;"; // left.type == "Identifier"
//const f = "function _start() { let pc, pi; pc[0]=3;pi[4]=10 };"; // wasmer NG
//const f = "export function _start() { let v, pc; v=pc[0] }";
//const f = "let fa, fb; fa+fb;";
//const f = "let fa = 3;";
//const f = "function a() { function b(){} };"
//const f = "const fa = 3.14, ia = 300;";
//const f = "const fa = 3.14, ia = 300; export function _start() { return fa }";
const f = `const ps_GAMEPAD1 = 0x16;
let x = 0;
export function _update() {
 x = ps_GAMEPAD1[0];
}`;

const wat = Mochi.compile(f, { debug: true });
console.log(wat);
await Deno.writeTextFile("test.wat", wat);
