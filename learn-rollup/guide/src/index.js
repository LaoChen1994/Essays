import add from './add'
import get from 'lodash/get'
import answer from 'the-answer'

export default () => {
  const a = {a: 1, b: 2}
  console.log(answer)

  console.log(get(a, 'a'))
  console.log(add(1, 2))
}