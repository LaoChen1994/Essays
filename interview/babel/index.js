const fs = require("fs");
const { parse } = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");
const { default: generator } = require("@babel/generator");
const t = require("@babel/types");

const code = fs.readFileSync("./code.js").toString();
// 用于获取唯一的标识符
const getUid = () => {
  let uid = 0;
  return () => `_${uid++ || ""}`;
};

const ast = parse(code);

traverse(ast, {
  FunctionDeclaration(path) {
    // 获取第一个参数
    const firstParam = path.get("params.0");
    if (firstParam == null) {
      return;
    }

    const currentName = firstParam.node.name;
    const currentBinding = path.scope.getBinding(currentName);
    const gid = getUid();
    let sname;

    // 循环找出没有被占用的变量名
    while (true) {
      sname = gid();

      // 首先看一下父作用域是否已定义了该变量
      if (path.scope.parentHasBinding(sname)) {
        continue;
      }

      // 检查当前作用域是否定义了变量
      if (path.scope.hasOwnBinding(sname)) {
        // 已占用
        continue;
      }

      //  再检查第一个参数的当前的引用情况,
      // 如果它所在的作用域定义了同名的变量，我们也得放弃
      if (currentBinding.references > 0) {
        let findIt = false;
        for (const refNode of currentBinding.referencePaths) {
          if (refNode.scope !== path.scope && refNode.scope.hasBinding(sname)) {
            findIt = true;
            break;
          }
        }
        if (findIt) {
          continue;
        }
      }
      break;
    }

    // 开始替换掉
    const i = t.identifier(sname);
    currentBinding.referencePaths.forEach((p) => p.replaceWith(i));
    firstParam.replaceWith(i);
  },
});

console.log(generator(ast).code);
