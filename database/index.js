import mongoose from 'mongoose'

import { db, app } from '../config'

export { User } from './models/user'

const { host, port, name } = db
const connectionString = `mongod://${host}:${port}/${name}`
const connectionOptions = { useNewUrlParser: true }

// mongoose configurations
mongoose.Promise = global.Promise
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true)
}

// create connection
mongoose.connect(
  connectionString,
  connectionOptions
)

// mongoose hooks logging
mongoose.connection
  .on('error', err => {
    console.error(`* Could not establish connection to a MongoDB service.`, err)
  })
  .on('connected', () => {
    console.log(`> Connected to a MongoDB service succesfully.`)
  })
  .on('disconnected', () => {
    console.info(`> Disconnected from the MongoDB service.`)
  })
