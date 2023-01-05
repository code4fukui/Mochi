import { program } from 'https://code4fukui.github.io/commander-es/index.js';
import { Mochi } from "./Mochi.js";
import { importWASM } from "./wasmutil.js";

program
  .version("0.0.2")
  .argument("<*.mochi.js | *.wat | *.wasm>")
  .option("--js", "run as JavaScript")
  .option("--wat", "make WAT file")
  .option("--wasm", "make WASM file")
  .option("--wasi", "make with WASI runtime")
  .option("--wasm4", "make with WASM-4 runtime")
  .parse();

const setExtension = (fn, ext) => {
  const n2 = fn.lastIndexOf(".mochi.js");
  if (n2 >= 0) {
    return fn.substring(0, n2) + "." + ext;
  }
  const n = fn.lastIndexOf(".");
  if (n < 0) {
    return fn + "." + ext;
  }
  return fn.substring(0, n + 1) + ext;
};

const fn = program.processedArgs[0];
const opts = program.opts();
//console.log(opts);

if (fn.endsWith(".mochi.js")) {
  if (opts.js) {
    const m = await import(fn);
    console.log(m._start());
  } else {
    const src = await Deno.readTextFile(fn);
    const getOptions = async () => {
      if (opts.wasi) {
        return { append: await Deno.readTextFile("./wasi.watx") };
      } else if (opts.wasm4) {
        return {
          append: await Deno.readTextFile("./wasm4.watx"),
          exports: {
            "start": [],
            "update": [],
          }
        };
      }
      return null;
    };
    const wat = Mochi.compile(src, await getOptions());
    if (opts.wat) {
      await Deno.writeTextFile(setExtension(fn, "wat"), wat);
    }
    if (opts.wasm) {
      const { wat2wasm } = await import("https://code4fukui.github.io/WABT-es/wat2wasm.js");
      const bin = wat2wasm(wat);
      await Deno.writeFile(setExtension(fn, "wasm"), bin);
    }
  }
} else {
  const wasm = await importWASM(fn);
  console.log(wasm._start());
}
