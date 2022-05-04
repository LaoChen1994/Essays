# 装饰器写法

## 装饰器执行顺序

装饰器的执行顺序为：属性装饰器 -> 方法装饰器 -> 类装饰器



## 装饰器的写法

属性装饰器参数中有三个值`target`，`name`和`descriptor`，这三样东西大致可以理解：

+ target：为需要装饰的属性本身，所在的上下文，我理解是对应的this的指向
+ name：是对应的参数名
+ descriptor：该值的描述，用来控制`writable`、`readable`等，其中`value`对其赋值可以改变其本身的值（只有装饰的属性是个类方法的时候才会有，如果是类属性就是`undefined`）



### 属性装饰器

需要通过`target[name]`的方式对其进行操作，或者如果是有其他联动的操作，可以直接操作target来实现我们的目的

```typescript
// 类属性修饰器
// 目前来看只能修饰一个静态方法
export function add (plus: number): Function {
    return function(target: any, name: string, descriptor: any) {
        target[name] = target[name] + plus;

        return descriptor
    }
}

// 用法
export default class TestController {
    @add(3)
    static a = 1;
}
```



### 方法装饰器

方法装饰器目前需要直接操作`descriptor.value`来对方法进行魔改，来加强对应修饰方法的功能，比如我们想为魔改的方法增加log的功能，我们可以这么做，比如我们现在想要去对请求增加cors的请求头，可以这么做

```typescript
import { Middleware } from "koa";

export function cors() {
  return function (target: any, name: string, descriptor: any) {
    const fn: Function = descriptor.value;

    const cors: Middleware = async function (this: any, ...args) {
      const ctx = args[0]
      await fn.apply(this, args)
      ctx.set("Access-Control-Allow-Origin", "*");
      ctx.set("Access-Control-Allow-Headers", "*");
      ctx.set("Access-Control-Methods", "*");
    };
    descriptor.value = cors
  };
}

```



