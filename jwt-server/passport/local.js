import { Strategy as LocalStrategy } from 'passport-local'

import { User } from '..'

async function verify(req, email, password, next) {
  try {
    // Check that a user exists with the given email.
    const found = await User.findOne({ 'local.email': email })
    if (!found) {
      return next(null, false, { message: 'User not found' })
    }
    // Authenticate the given password with the hash
    const authenticated = await found.authenticate(password)
    return authenticated
      ? // Pass the user to the next middleware if valid.
        next(null, found)
      : // Inform the client if the id is not found.
        next(null, false, { message: 'Incorrect email or password' })
  } catch (err) {
    // return any initial errors
    return next(err)
  }
}

const options = {
  usernameField: 'email',
  passwordFiled: 'password',
  passReqToCallback: true,
}

export default new LocalStrategy(options, verify)
