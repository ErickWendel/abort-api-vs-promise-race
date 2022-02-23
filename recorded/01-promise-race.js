// fetch é experimental, tem que lembrar de usar o --experimental-fetch
const url = 'http://localhost:3000'
import assert from 'assert'

async function race(request, limitTimeout) {
  const limiter = new Promise((r, reject) => setTimeout(reject, limitTimeout))
  return Promise.race([
    request,
    limiter
  ])
}

// dado um timeout maior que o esperado pela API, erro
{
  const limitTimeout = 100
  assert.rejects(async () => {
    const fetchResult = await race(fetch(url), limitTimeout)
    return fetchResult.json()
  })
}

// dado timeout limite maior que o limite da API, sucesso!
{
  const limitTimeout = 500
  const fetchResult = await race(fetch(url), limitTimeout)
  const result = await fetchResult.json()
  const expected = {
    name: 'erickwendel',
    age: '27',
    profession: 'software developer'
  }

  assert.deepStrictEqual(result, expected, 'objects must have the same value')

}