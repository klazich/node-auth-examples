import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { User } from '..'

async function verify(req, jwtPayload, next) {
  try {
    // Check a user with the id from the JWT payload.
    const found = await User.findById(jwtPayload.id)
    return found
      ? // Pass the user to the next middleware if found.
        next(null, found)
      : // Inform the client if the id is not found.
        next(null, false, { message: 'User not found' })
  } catch (err) {
    return next(err)
  }
}

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
}

export default new JwtStrategy(options, verify)
