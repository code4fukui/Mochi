export const getWASM = async (fn) => {
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

export const importWASM = async (fn, imports = {}) => {
  const bin = await getWASM(fn);
  const module = new WebAssembly.Module(bin);
  //const mem = new WebAssembly.Memory({ initial: 1 });
  const instance = new WebAssembly.Instance(module, imports);
  return instance.exports;
};

export const pc2s = (pc) => {
  return pc.map(c => {
    if (typeof c == "string") {
      return c;
    }
    return String.fromCharCode(c);
  }).join("");
};

export const s2pc = (s) => {
  return (s + "\0").split("").map(c => c.charCodeAt(0));
};
