# 从零搭建vue 3 + ts + jsx

## 1 环境搭建

```bash
# 全局安装vite
yarn add -g create-vite-app

# 通过vite安装相关依赖
yarn create vite-app vue-template

# 安装相关的ts依赖
yarn add -D typescript

# 初始化tsconfig
npx tsc --init

# 安装eslint配置
yarn add -D eslint eslint-plugin-vue

# 初始化eslint配置
npx eslint --init

# 集成prettier
yarn add --dev prettier eslint-config-prettier eslint-plugin-prettier

# 安装vue jsx插件支持vue使用jsx
yarn add vite -S
yarn add @vitejs/plugin-vue @vitejs/plugin-vue-jsx -S
```

## 2. TS初始化配置

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": ["ES2015", "ES2016", "ES2017"],
    "allowJs": true,
    "checkJs": false,
    "jsx": "react",
    "sourceMap": true,
    "outDir": "./dist",
    "downlevelIteration": true,
    "strict": true,
    "baseUrl": "./app",
    "typeRoots": ["./node_modules/@types"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "./src/*"
  ],
  "exclude": ["node_modules"]
}

```

## 3. 初始化eslint配置

根据eslint的命令行提示选择对应的规则就行，大致lint规则如下

```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 12,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "vue",
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

## 4. vite配置

1. vite的入口在dev的时候都是根目录下的index.html文件

2. 如果我们想要引入我们的入口文件，则：

   ```html
   <script type="module" src="/src/main.ts"></script>
   ```
3. 简单的整体配置如下：

```typescript
import { defineConfig } from 'vite';
// 类似vue-loader
import vue from '@vitejs/plugin-vue'
// 用于将jsx作为template进行编译
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path';

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

module.exports = defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': pathResolve('./src'),
    },
    extensions: ['.tsx', '.vue', '.ts', '.js'],
  },
});
```

## 5. 实验结果

