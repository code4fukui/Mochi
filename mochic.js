import { program } from 'https://code4fukui.github.io/commander-es/index.js';
import { Mochi } from "./Mochi.js";

program
  .version("0.0.1")
  .argument("<*.mochi to compile | *.wat to run main>")
  .option("--wasm")
  .parse();

const setExtension = (fn, ext) => {
  const n = fn.lastIndexOf(".");
  if (n < 0) {
    return fn + "." + ext;
  }
  return fn.substring(0, n + 1) + ext;
};

const fn = program.processedArgs[0];
//console.log(program.opts());

if (fn.endsWith(".mochi")) {
  const src = await Deno.readTextFile(fn);
  const wat = Mochi.compile(src);
  await Deno.writeTextFile(setExtension(fn, "wat"), wat);
  if (program.opts().wasm) {
    const { wat2wasm } = await import("https://code4fukui.github.io/WABT-es/wat2wasm.js");
    const bin = wat2wasm(wat);
    await Deno.writeFile(setExtension(fn, "wasm"), bin);
  }
} else {
  const getWASM = async (fn) => {
    if (fn.endsWith(".wat")) {
      const { WABT } = await import("https://code4fukui.github.io/WABT-es/WABT.js");
      const src = await Deno.readTextFile(fn);
      const wabt = await WABT();
      const module = wabt.parseWat("test.wast", src);
      const mbin = module.toBinary({ log: true });
      //console.log(mbin.log);
      return mbin.buffer;
    } else if (fn.endsWith(".wasm")) {
      return await Deno.readFile(fn);
    } else {
      throw new Error("not wat/wasm");
    }
  };
  const bin = await getWASM(fn);
  const wasm = new WebAssembly.Module(bin);
  //const mem = new WebAssembly.Memory({ initial: 1 });
  const imports = {};
  const instance = new WebAssembly.Instance(wasm, imports);
  console.log(instance.exports.main());
}
