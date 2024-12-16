import * as esprima from "https://code4fukui.github.io/esprima/es/esprima.min.js";

const parse = (src) => {
  const ast = esprima.parseModule(src);
  return ast;
};

const getNameType = (name) => {
  if (name.length == 1 || name.startsWith("i") || name.startsWith("p")) {
    return "i32";
  } else if (name.startsWith("f")) {
    return "f32";
  } else if (name.startsWith("s")) {
    return "i16";
  } else if (name.startsWith("c")) {
    return "i8";
  } else {
    throw new Error("not supported type: " + name);
  }
};
const getASTType = (ast) => {
  if (ast.type == "ExpressionStatement") {
    return getASTType(ast);
  } else if (ast.type == "BinaryExpression") {
    return getASTType(ast.left);
  } else if (ast.type == "Identifier") {
    return getNameType(ast.name);
  } else if (ast.type == "CallExpression") {
    return getNameType(ast.callee.name);
  } else if (ast.type == "MemberExpression") {
    return getNameType(ast.object.name);
  }
  console.log(ast)
  throw new Error("can't getASTType: " + ast.type);
};

const getMember = (name) => {
  if (name[0] != "p" || name.length == 1) {
    throw new Error("must start with 'p'");
  }
  const type = name[1];
  return { name, type };
};

const opmap = {
  "*": "mul",
  "/": "div_s",
  "+": "add",
  "-": "sub",
  "%": "rem_s",
  "==": "eq",
  "<": "lt_s",
  ">": "gt_s",
  "<=": "le_s",
  ">=": "ge_s",
  "||": "or",
  "&&": "and",
  "&": "and",
};
const getOperator = (op, ast) => { // ex) i32.add
  const op0 = op != "==" && op != ">=" && op.endsWith("=") ? op.substring(0, op.length - 1) : op;
  const opw = opmap[op0];
  if (!opw) {
    throw new Error("unsupported operator: " + op0);
  }
  const type = getASTType(ast);
  const op2 = type != "i32" && opw.endsWith("_s") ? opw.substring(0, opw.length - 2) : opw;
  return type + "." + op2;
};

const compile = (src, opts = {}) => {
  let nseq = 0;
  const seq = () => {
    return nseq++;
  };
  const blockstack = [];
  let infunc = null;

  const globalvars = {};
  const getlocalornot = (name) => globalvars[name] ? "global.get" : "local.get";
  const setlocalornot = (name) => {
    const v = globalvars[name];
    if (v == "const") {
      throw new Exception("can't set const global vars: " + name);
    }
    return v ? "global.set" : "local.set";
  };

  const exportfuncs = opts.exports || {};
  
  const walk = (ast) => {
    if (ast.type == "Program") {
      const res = ast.body.map(b => walk(b));
      const hasmem = true;
      const mem = hasmem ? `(memory 1)\n(export "memory" (memory 0))\n` : "";
      const append = opts.append ? opts.append : mem;
      return `(module\n${append}${res.join("\n")}\n)\n`;
    } else if (ast.type == "BlockStatement") {
      const res = ast.body.map(b => walk(b));
      return res.join("\n");
    } else if (ast.type == "ExpressionStatement") {
      return walk(ast.expression);
    } else if (ast.type == "Identifier") {
      return `(${getlocalornot(ast.name)} $${ast.name})`;
    } else if (ast.type == "Literal") {
      if (ast.raw[0] == "'") {
        return `(i32.const ${ast.value.charCodeAt(0)})`;
      } else if (typeof ast.value == "boolean") {
        return `(i32.const ${ast.value ? 1 : 0})`;
      } else if (ast.raw.indexOf(".") >= 0) {
        return `(f32.const ${ast.value})`;
      }
      return `(i32.const ${ast.value})`;
    } else if (ast.type == "BinaryExpression" || ast.type == "LogicalExpression") {
      const op = getOperator(ast.operator, ast.left);
      if (op) {
        return `(${op} ${walk(ast.left)} ${walk(ast.right)})`;
      }
    } else if (ast.type == "AssignmentExpression") {
      if (ast.left.type == "Identifier") {
        if (ast.operator == "=") {
          return `(${setlocalornot(ast.left.name)} $${ast.left.name} ${walk(ast.right)})`;
        } else {
          const v = ast.left.name;
          const op = getOperator(ast.operator, ast.left);
          if (op) {
            return `(${setlocalornot(v)} $${v} (${op} (${getlocalornot(v)} $${v}) ${walk(ast.right)}))`;
          }
        }
      } else if (ast.left.type == "MemberExpression") {
        const { name, type } = getMember(ast.left.object.name);
        if (type == "c") {
          if (ast.operator == "=") {
            return `(i32.store8 (i32.add (${getlocalornot(name)} $${name}) ${walk(ast.left.property)}) ${walk(ast.right)})`;
          }
        } else if (type == "s") {
          if (ast.operator == "=") {
            return `(i32.store16 (i32.add (${getlocalornot(name)} $${name}) (i32.mul (i32.const 2) ${walk(ast.left.property)})) ${walk(ast.right)})`;
          }
        } else if (type == "i") {
          if (ast.operator == "=") {
            return `(i32.store (i32.add (${getlocalornot(name)} $${name}) (i32.mul (i32.const 4) ${walk(ast.left.property)})) ${walk(ast.right)})`;
          }
        } else if (type == "f") {
          if (ast.operator == "=") {
            return `(f32.store (i32.add (${getlocalornot(name)} $${name}) (i32.mul (i32.const 4) ${walk(ast.left.property)})) ${walk(ast.right)})`;
          }
        }
      }
    } else if (ast.type == "UpdateExpression") {
      if (ast.operator == "++") {
        const v = ast.argument.name;
        return `(${setlocalornot(v)} $${v} (i32.add (${getlocalornot(v)} $${v}) (i32.const 1)))`;
      } else if (ast.operator == "--") {
        const v = ast.argument.name;
        return `(${setlocalornot(v)} $${v} (i32.sub (${getlocalornot(v)} $${v}) (i32.const 1)))`;
      }
    } else if (ast.type == "CallExpression") {
      const param = ast.arguments.length == 0 ? "" : " " + ast.arguments.map(a => walk(a)).join(" ");
      const fname = ast.callee.name;
      if (fname == "i32") {
        return `(i32.trunc_f32_s${param})`;
      } else if (fname == "f32") {
        return `(f32.convert_i32_s${param})`;
      }
      return `(call $${fname}${param})`;
    } else if (ast.type == "IfStatement") {
      if (!ast.alternate) {
        return `(if ${walk(ast.test)} (then\n${walk(ast.consequent)}\n))`;
      } else {
        return `(if ${walk(ast.test)} (then\n${walk(ast.consequent)}\n) (else\n${walk(ast.alternate)}))`;
      }
    } else if (ast.type == "WhileStatement") {
      const n = seq();
      const bname = "$w" + n;
      const lname = "$l" + n;
      blockstack.push(bname);
      const res = `(block ${bname} (loop ${lname}\n(br_if ${bname} (i32.sub (i32.const 1) ${walk(ast.test)}))\n${walk(ast.body)}\n(br ${lname})\n))`;
      blockstack.pop();
      return res;
    } else if (ast.type == "ForStatement") {
      const bname = "$w" + seq();
      blockstack.push(bname);
      const init = walk(ast.init) + "\n";
      const brcond = ast.test ? `(br_if ${bname} (i32.sub (i32.const 1) ${walk(ast.test)}))\n` : "";
      const loop = `(block ${bname} (loop ${bname}_\n${brcond}${walk(ast.body)}\n${walk(ast.update)}\n(br ${bname}_)\n))`;
      blockstack.pop();
      return init + loop;
    } else if (ast.type == "BreakStatement") {
      const bname = blockstack[blockstack.length - 1];
      return `(br ${bname})`;
    } else if (ast.type == "VariableDeclaration") {
      if (infunc) {
        const res = [];
        for (const d of ast.declarations) {
          res.push(`(local $${d.id.name} ${getNameType(d.id.name)})`);
          if (d.init) {
            throw new Error("can't set initial value in a function");
          }
        }
        return res.join("\n");
      } else { // global
        const res = [];
        for (const d of ast.declarations) {
          const name = d.id.name;
          const chk = globalvars[name];
          if (chk) {
            throw new Exception("already exists global var: " + name);
          }
          globalvars[name] = true;
          const t = getNameType(d.id.name);
          if (!d.init) {
            throw new Error("must set initial value in global");
          }
          const mut = ast.kind == "const" ? t : `(mut ${t})`;
          if (d.init.type != "Literal") {
            throw new Error("can't calc for global");
          }
          res.push(`(global $${d.id.name} ${mut} (${t}.const ${d.init.value}))`);
        }
        return res.join("\n");
      }
    } else if (ast.type == "FunctionDeclaration") {
      if (infunc) {
        throw new Exception("can't put func in func");
      }
      infunc = ast.id.name;
      let res;
      const p = ast.params.map(p => `(param $${p.name} ${getNameType(p.name)})`).join(" ");
      const expf = exportfuncs[ast.id.name];
      if (!expf) {
        const result = ast.id.name[0] == "_" ? "" : `(result ${getNameType(ast.id.name)})`;
        res = `(func $${ast.id.name} ${p.length ? p + " " : ""}${result}\n${walk(ast.body)}\n)`;
      } else {
        const result = expf.result ? `(result ${expf.result})` : "";
        res = `(func $${ast.id.name} ${p.length ? p + " " : ""}${result}\n${walk(ast.body)}\n)`;
      }
      infunc = null;
      return res;
    } else if (ast.type == "ExportNamedDeclaration") {
      const name = ast.declaration.id.name;
      return `(export "${name}" (func $${name}))\n` + walk(ast.declaration);
    } else if (ast.type == "ReturnStatement") {
      return walk(ast.argument) + "\n(return)";
    } else if (ast.type == "ImportDeclaration") {
      if (ast.source.value.endsWith(".watx")) {
        const src = Deno.readTextFileSync(ast.source.value);
        return src;
      }
      return "";
    } else if (ast.type == "EmptyStatement") {
      return "";
    } else if (ast.type == "MemberExpression") {
      const { name, type } = getMember(ast.object.name);
      if (type == "c") {
        return `(i32.load8_u (i32.add (${getlocalornot(name)} $${name}) ${walk(ast.property)}))`;
      } else if (type == "s") {
        return `(i32.load16_u (i32.add (${getlocalornot(name)} $${name}) ${walk(ast.property)}))`;
      } else if (type == "i") {
        return `(i32.load (i32.add (${getlocalornot(name)} $${name}) ${walk(ast.property)}))`;
      }
    }
    console.log(JSON.stringify(ast, null, 2));
    throw new Error("unsupported:" + ast.type + " / " + ast?.operator);
  };

  const ast = parse(src);
  if (opts?.debug) {
    console.log(JSON.stringify(ast, null, 2));
  }
  try {
    return walk(ast);
  } catch (e) {
    throw e;
  }
}

export const Mochi = { compile, parse };
