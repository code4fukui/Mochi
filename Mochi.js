import * as esprima from "https://code4fukui.github.io/esprima/es/esprima.min.js";

const compile = (src) => {
  let nseq = 0;
  const seq = () => {
    return nseq++;
  };
  const blockstack = [];
  
  const walk = (ast) => {
    if (ast.type == "Program") {
      const res = ast.body.map(b => walk(b));
      return `(module\n${res.join("\n")}\n)\n`;
    } else if (ast.type == "BlockStatement") {
      const res = ast.body.map(b => walk(b));
      return res.join("\n");
    } else if (ast.type == "ExpressionStatement") {
      return walk(ast.expression);
    } else if (ast.type == "Identifier") {
      return `(local.get $${ast.name})`;
    } else if (ast.type == "Literal") {
      if (ast.raw[0] == "'") {
        return `(i32.const ${ast.value.charCodeAt(0)})`;
      } else if (typeof ast.value == "boolean") {
        return `(i32.const ${ast.value ? 1 : 0})`;
      }
      return `(i32.const ${ast.value})`;
    } else if (ast.type == "BinaryExpression") {
      if (ast.operator == "*") {
        return `(i32.mul ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == "/") {
        return `(i32.din_s ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == "+") {
        return `(i32.add ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == "==") {
        return `(i32.eq ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == "<") {
        return `(i32.lt_s ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == ">") {
        return `(i32.gt_s ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == "<=") {
        return `(i32.le_s ${walk(ast.left)} ${walk(ast.right)})`;
      } else if (ast.operator == ">=") {
        return `(i32.ge_s ${walk(ast.left)} ${walk(ast.right)})`;
      }
    } else if (ast.type == "AssignmentExpression") {
      if (ast.operator == "=") {
        return `(local.set $${ast.left.name} ${walk(ast.right)})`;
      } else if (ast.operator == "+=") {
        const v = ast.left.name;
        return `(local.set $${v} (i32.add (local.get $${v}) ${walk(ast.right)}))`;
      } else if (ast.operator == "-=") {
        const v = ast.left.name;
        return `(local.set $${v} (i32.sub (local.get $${v}) ${walk(ast.right)}))`;
      } else if (ast.operator == "*=") {
        const v = ast.left.name;
        return `(local.set $${v} (i32.mul (local.get $${v}) ${walk(ast.right)}))`;
      } else if (ast.operator == "/=") {
        const v = ast.left.name;
        return `(local.set $${v} (i32.div_s (local.get $${v}) ${walk(ast.right)}))`;
      }
    } else if (ast.type == "UpdateExpression") {
      if (ast.operator == "++") {
        const v = ast.argument.name;
        return `(local.set $${v} (i32.add (local.get $${v}) (i32.const 1)))`;
      } else if (ast.operator == "--") {
        const v = ast.argument.name;
        return `(local.set $${v} (i32.sub (local.get $${v}) (i32.const 1)))`;
      }
    } else if (ast.type == "CallExpression") {
      const param = ast.arguments.length == 0 ? "" : " " + ast.arguments.map(a => walk(a)).join(" ");
      return `(call $${ast.callee.name}${param})`;
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
      const loop = `(block ${bname} (loop ${bname}_\n(br_if ${bname} (i32.sub (i32.const 1) ${walk(ast.test)}))\n${walk(ast.body)}\n${walk(ast.update)}\n(br ${bname}_)\n))`;
      blockstack.pop();
      return init + loop;
    } else if (ast.type == "BreakStatement") {
      const bname = blockstack[blockstack.length - 1];
      return `(br ${bname})`;
    } else if (ast.type == "VariableDeclaration") {
      const res = [];
      for (const d of ast.declarations) {
        res.push(`(local $${d.id.name} i32)`);
        if (d.init) {
          throw new Error("can't set initial value");
        }
      }
      return res.join("\n");
    } else if (ast.type == "FunctionDeclaration") {
      const p = ast.params.map(p => `(param $${p.name} i32)`).join(" ");
      const result = ast.id.name == "_start" ? "" : "(result i32)"
      return `(func $${ast.id.name} ${p.length ? p + " " : ""}${result}\n${walk(ast.body)}\n)`; 
    } else if (ast.type == "ReturnStatement") {
      return walk(ast.argument) + "\n(return)";
    } else if (ast.type == "ImportDeclaration") {
      const src = Deno.readTextFileSync(ast.source.value);
      return src;
    }
    throw new Error("unsupported:" + ast.type + " / " + ast?.operator);
  };

  const ast = esprima.parseModule(src);
  try {
    return walk(ast);
  } catch (e) {
    console.log(JSON.stringify(ast, null, 2));
    throw e;
  }
}

export const Mochi = { compile };
