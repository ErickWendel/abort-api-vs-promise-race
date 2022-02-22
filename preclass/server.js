import { setTimeout } from 'timers/promises'
import {
  createServer
} from 'http'

const result = {
  name: 'erickwendel',
  age: '27',
  profession: 'software developer'
}
const MAX_TIMEOUT = 200
async function handler(request, response) {
  await setTimeout(MAX_TIMEOUT)
  return response.end(JSON.stringify(result))
}

createServer(handler).listen(3000)
  .on('listening', () => console.log('server listening at 3000'))