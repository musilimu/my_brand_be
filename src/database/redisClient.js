import Redis from 'redis'
import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const connectionString = process.env.REDIS_URL
const [, password, hostname, port] = connectionString.match(
  /rediss:\/\/[^:]+:([^@]+)@([^:]+):(\d+)/,
)

export const client = Redis.createClient({
  legacyMode: true,
  socket: {
    host: hostname,
    port: parseInt(port),
  },
  password,
}).on('connect', () => {
  console.log('Connected to Redis server!')
})
