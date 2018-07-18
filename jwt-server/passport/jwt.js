import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'

import { User } from '..'

const secret = process.env.JWT_SECRET

const verify = (jwtPayload, done) => {
  if (jwtPayload.expires > Date.now()) {
    return done('jwt expired')
  }

  return done(null, jwtPayload)
}

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    req => (req && req.cookies ? req.cookies['jwt'] : null),
  ]),
  secretOrKey: secret,
}

export default new JwtStrategy(options, verify)
