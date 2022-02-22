// fetch é experimental, tem que lembrar de usar o --experimental-fetch --no-warnings
const url = 'http://localhost:3000'
import assert from 'assert'

async function race(request, limitTimeout) {
  const limiter = new Promise((r, reject) => setTimeout(reject, limitTimeout))
  return Promise.race([
    request,
    limiter
  ])
}

{
  const limitTimeout = 100

  assert.rejects(async () => {
    const fetchResult = await race(fetch(url), limitTimeout)
    return fetchResult.json()
  })
}

{
  const limitTimeout = 500

  const fetchResult = await race(fetch(url), limitTimeout)
  const expected = {
    name: 'erickwendel',
    age: '27',
    profession: 'software developer'
  }

  assert.deepStrictEqual(await fetchResult.json(), expected)
}