import passport from 'passport';
import {
  Strategy as LocalStrategy,
  VerifyFunction as LocalStrategyVerifyFn,
} from 'passport-local';
import {
  Strategy as JWTStrategy,
  StrategyOptions as JWTStrategyOptions,
  VerifyCallback as JWTStrategyVerifyFn,
} from 'passport-jwt';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../service/auth.service';
import { AUTH_INVALID_CREDENTIALS, AUTH_TOKEN_EXPIRED } from '../common/responseErrors';

/**
 * Passport strategy for reading JWT from body of request
 */
const localStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

const localStrategy = new LocalStrategy(localStrategyOptions, async (email, password, done) => {
  const user = await findUserByEmail(email);
  let passwordsMatch = false;

  if (user) {
    passwordsMatch = await bcrypt.compare(password, user.password);
  }

  if (passwordsMatch) {
    return done(null, user);
  } else {
    return done({ statusCode: 401, message: AUTH_INVALID_CREDENTIALS }, null);
  }
});

passport.use('local', localStrategy);

/**
 * Passport strategy for reading JWT from cookie
 */
const jwtStrategyOptions: JWTStrategyOptions = {
  jwtFromRequest: req => (req.cookies.jwt),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtStrategyOptions, (jwtPayload, done) => {
  if (Date.now() > jwtPayload.expires) {
    return done({ statusCode: 401, message: AUTH_TOKEN_EXPIRED }, null);
  }

  return done(null, jwtPayload);
});

passport.use('jwt', jwtStrategy);
