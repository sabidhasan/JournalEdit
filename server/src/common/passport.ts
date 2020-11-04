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

/**
 * Passport strategy for reading JWT from 
 */
const localStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
};

const localStrategy = new LocalStrategy(localStrategyOptions, async (email, password, done) => {
  console.log('0')
  const user = await findUserByEmail(email);
  let passwordsMatch = false;

  if (user) {
    passwordsMatch = await bcrypt.compare(password, user.password);
  }

  if (passwordsMatch) {
    console.log('1')
    return done(null, user);
  } else {
    console.log('2')
    return done('AUTH_ERROR_INVALID_CREDENTIALS', null);
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
    return done('AUTH_ERROR_TOKEN_EXPIRED', null);
  }

  return done(null, jwtPayload);
});

passport.use('jwt', jwtStrategy);
