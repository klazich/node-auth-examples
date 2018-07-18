import mongoose, { Schema } from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

// USER SCHEMA
export const UserSchema = Schema({
  hash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    index: {
      unique: true,
    },
    unique: true,
    dropDups: true,
    required: true,
  },
  // Third-party credentials
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String,
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String,
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String,
  },
})

// USER STATIC METHODS
UserSchema.statics = {
  /**
   * Static method on the User class for generating
   * password hashes.
   *
   * An argument could be made to inline this into the middleware bellow.
   */
  async generateHash(password) {
    return argon2.hash(password, { type: argon2.argon2id })
  },
}

// USER INSTANCE METHODS
UserSchema.methods = {
  /**
   * Password authentication for User instances.
   */
  async authenticate(password) {
    return argon2.verify(this.hash, password)
  },
  /**
   * Json web tokenization for User instances.
   */
  async generateToken() {
    return jwt.sign(this, process.env.JWT_SECRET)
  },
}

// USER VIRTUAL ATTRIBUTES
UserSchema.virtual('password').set(async function(password) {
  /**
   * This `password` virtual attribute works as a temporary holder for the
   * password and also as a flag to mongoose middleware hooks (see the User
   * Middleware below on how this is used).
   *
   * Mongoose virtual attributes do not get persisted into the Mongo database
   * therefore.
   */
  this._password = password
})

// USER MIDDLEWARE
UserSchema.pre('save', async function(next) {
  if (this._password) {
    try {
      const hash = await this.generateHash(this._password)
      this.hash = hash
      return next()
    } catch (err) {
      console.error(err)
      return next(err)
    } finally {
      delete this._password // I'm not sure if this is necessary.
    }
  }
})

// MODEL CREATION AND EXPORT
export const User = mongoose.model('User', userSchema)
