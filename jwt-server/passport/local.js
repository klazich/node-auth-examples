import { Strategy as LocalStrategy } from 'passport-local'

import { User } from '..'

const verify = async (email, password, done) => {
  try {
    const userDocument = await User.findOne({ email }).exec()
    const authenticated = await userDocument.authenticate(password)

    return authenticated
      ? done(null, userDocument)
      : done('Incorrect Email / Password')
  } catch (err) {
    done(err)
  }
}

const options = {
  usernameField: 'email',
  passwordField: 'password',
}

export default new LocalStrategy(options, verify)
