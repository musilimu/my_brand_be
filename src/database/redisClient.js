import Redis from 'redis'

export const client = Redis.createClient({
  legacyMode: true,
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: process.env.REDIS_PORT
  },
  password: process.env.REDIS_PASSWORD
}).on('connect', () => {
  console.log('Connected to redis server!')
})
