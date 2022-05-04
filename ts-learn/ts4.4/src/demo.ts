const c: string | number = Math.random() > 0.5 ? 1 : '1'

if (typeof c === 'string') {
  // 做A
  c.toUpperCase()
}

// .....省略其他逻辑

if (typeof c === 'string') {
  // 做B
  c.split('')
}

// .....省略其他逻辑

if (typeof c === 'string') {
  // 做C
  c.indexOf(',')
}