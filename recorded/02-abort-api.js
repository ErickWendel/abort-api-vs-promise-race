const url = 'http://localhost:3000'
import assert from 'assert'
const tracker = new assert.CallTracker()
process.on('exit', () => tracker.verify())

// usando AbortController + timeout, para simular o .race
{

  const limitTimeout = 100
  const abortController = new AbortController()
  setTimeout(() => abortController.abort(), limitTimeout)

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

// usando o AbortSignal.timeout + callTracker
{

  const limitTimeout = 100
  const signal = AbortSignal.timeout(limitTimeout)

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal
    })

    return fetchResult.json()
  }, {
    message: 'The operation was aborted',
    name: 'AbortError'
  })

}

// usando o AbortSignal.timeout + callTracker nativo
{
  const limitTimeout = 100
  const signal = AbortSignal.timeout(limitTimeout)
  const expectedCount = 1
  signal.onabort = tracker.calls(expectedCount)

  assert.rejects(async () => {
    const fetchResult = await fetch(url, {
      signal
    })

    return fetchResult.json()
  }, {
    message: 'The operation was aborted',
    name: 'AbortError'
  })

}

// recebendo respostas sem erros
{
  const limitTimeout = 500
  const signal = AbortSignal.timeout(limitTimeout)

  const fetchResult = await fetch(url, {
    signal
  })

  const result = await fetchResult.json()
  const expected = {
    name: 'erickwendel',
    age: '27',
    profession: 'software developer'
  }

  assert.deepStrictEqual(result, expected, 'objects must have the same value')


}