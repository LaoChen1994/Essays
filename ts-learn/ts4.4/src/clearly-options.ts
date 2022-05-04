// 更明确的undefined
interface Shape {
  name: string
  sideLength?: number
  radius?: number
}
const circle: Shape = {
  name: 'circle',
  radius: 1,
  sideLength: undefined
}