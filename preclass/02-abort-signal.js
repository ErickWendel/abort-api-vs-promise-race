// fetch é experimental, tem que lembrar de usar o --experimental-fetch --no-warnings
const url = 'http://localhost:3000'
import assert from 'assert'
const tracker = new assert.CallTracker()
process.on('exit', () => tracker.verify());

// usando o AbortController + setTimeout
{
  const limitTimeout = 100
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), limitTimeout);

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal: abortController.signal
    })
    return fetchResult.json()
  }, {
    message: 'The operation was aborted',
    name: 'AbortError'
  })
}

// usando o AbortSignal.timeout
{
  const limitTimeout = 100
  assert.rejects(async () => {
    const signal = AbortSignal.timeout(limitTimeout);

    const fetchResult = await fetch(url, {
      signal
    })
    console.log(await fetchResult.json())
  }, {
    message: 'The operation was aborted',
    name: 'AbortError'
  })
}

// usando o evento abort + callTracker nativo
{
  const limitTimeout = 100
  assert.rejects(async () => {
    const signal = AbortSignal.timeout(limitTimeout);
    const expectedCallCount = 1
    // valida que o listener de onabort é chamado quando ocorre um cancelamento de operação
    signal.onabort = tracker.calls(expectedCallCount);

    const fetchResult = await fetch(url, {
      signal
    })

    console.log(await fetchResult.json())
  }, {
    message: 'The operation was aborted',
    name: 'AbortError'
  })
}
// recebendo resposta sem erros
{
  const limitTimeout = 500
  const signal = AbortSignal.timeout(limitTimeout);
  const fetchResult = await fetch(url, {
    signal
  })
  const expected = {
    name: 'erickwendel',
    age: '27',
    profession: 'software developer'
  }

  assert.deepStrictEqual(await fetchResult.json(), expected)
}