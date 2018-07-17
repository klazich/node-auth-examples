import path from 'path'

export default {
  cwd: path.resolve(__dirname, '..'),
  app: {
    port: process.env.APP_PORT || 3001,
  },
  local: {
    port: process.env.LOCAL_AUTH_PORT || 3003,
  },
  jwt: {
    port: process.env.JWT_AUTH_PORT || 3002,
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'test',
  },
}
