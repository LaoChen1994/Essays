try {
  throw Error('我要报错啦')
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message)
  }
}