import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { findByEmail } from '../service/auth.service';

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  const user = await findByEmail(email);
  let passwordsMatch = false;

  if (user) {
    const { password: passwordHash } = user;
    passwordsMatch = await bcrypt.compare(password, passwordHash);
  }

  if (passwordsMatch) {
    return done(null, user);
  } else {
    return done('Incorrect Username / Password');
  }
}));

passport.use(new JWTStrategy({
    jwtFromRequest: req => req.body.jwt,
    secretOrKey: process.env.JWT_SECRET,
  },
  (jwtPayload, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('jwt expired');
    }

    return done(null, jwtPayload);
  }
));
