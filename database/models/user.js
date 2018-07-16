import mongoose, { Schema } from 'mongoose'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'

//// USER SCHEMA //////////////////////////////////////////////////////////////
export const UserSchema = Schema({
  hash: {
    type: String,
    default: '',
  },
  local: {
    email: String,
    unique: true,
    index: { unique: true },
  },
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

//// USER VIRTUALS ////////////////////////////////////////////////////////////
UserSchema.virtual('password').set(async function(password) {
  this._password = password
})

//// USER STATIC METHODS //////////////////////////////////////////////////////
UserSchema.statics = {
  /**
   * Static method on the User class for generating password hashes.
   */
  async generateHash(password) {
    return argon2.hash(password, { type: argon2.argon2id })
  },
}

//// USER INSTANCE METHODS ////////////////////////////////////////////////////
UserSchema.methods = {
  /**
   * Password authentication on User instances.
   */
  async authenticate(password) {
    return argon2.verify(this.hash, password)
  },
  /**
   * Tokenize User instance.
   */
  async generateToken() {
    return jwt.sign(this, process.env.JWT_SECRET)
  },
}

//// USER MIDDLEWARE //////////////////////////////////////////////////////////
UserSchema.pre('save', async function(next) {
  if (this._password) {
    try {
      const hash = await this.generateHash(this._password)
      this.hash = hash
      return next()
    } catch (err) {
      console.error(err)
      return next(err)
    }
  }
})

// Compile and export the User model
export const User = mongoose.model('User', userSchema)
