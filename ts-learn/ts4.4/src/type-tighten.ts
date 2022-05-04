// ts类型的收紧

// 1. 对于类型判断变量的理解
const a: string | number = Math.random() > 0.5 ? 'a' : 1
const aIsString = typeof a === 'string'

if (aIsString) {
  a.toUpperCase()
}

// 2. 解构类型的收紧
type Good = {
  type: 'plugin',
  performType: 'period' | 'count' | 'period_count'
} | {
  type: 'meal',
  mainGoodType: 'software' | 'plugin'
}

function getGoodType (good: Good) {
  const { type } = good

  if (type === 'meal') {
    return good.mainGoodType
  } else {
    return good.performType
  }
}

// 3. 复合类型的收紧

interface ISplit {
  strA?: string
  strB?: string
  numA?: number
}

function getStringSplit(props: ISplit) {
  const { strA, strB, numA } = props

  const isEffect = strA && strB && (numA || numA === 0)

  if (isEffect) {
    strA.toUpperCase()
    strB.split('')
    numA.toFixed(2)
  }
}