import passport from 'passport'

import LocalAuthentication from './local'
import JwtAuthorization from './jwt'

passport.use(LocalAuthentication)
passport.use(JwtAuthorization)
