// 支持更多元化的key
// 1. symbol作为key
interface Values {
  [key: string]: string
}

interface SymbolValue {
  [key: symbol]: string
}


const red = Symbol('red')
const blue = Symbol('blue')

const symbolColor1: SymbolValue = { [red]: '#f44', [blue]: '#348feb' }
const redColor = symbolColor1[red] // string

// 2. 使用自定义格式的参数名 
interface PrefixValue {
  type: string
  num: number
  [key: `prefix-${string}-end`]: string
}


const prefixValue: PrefixValue = {
  type: 'a',
  num: 1,
  'prefix-data-end': '1' // okay
  // 'prefix-e': 2 // error
}