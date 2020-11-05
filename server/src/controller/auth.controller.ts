/**
 * Required External Modules and Interfaces
 */
import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import { validate } from 'class-validator';
import * as authService from '../service/auth.service';
import { User } from '../entity/user.entity';
import { JWT_EXPIRATION_MS, HASH_COST } from '../config';
import { AUTH_INVALID_CREDENTIALS, INVALID_USER_SCHEMA } from '../common/responseErrors';

/**
 * Router Definition
 */
export const authController = express.Router();

/**
 * Helper methods
 */

export interface IJWTPayload {
  email: string;
  expires: number;
}

const generatePayload: (user: User) => IJWTPayload = (user) => ({
  email: user.email,
  expires: Date.now() + JWT_EXPIRATION_MS,
});

/**
 * Controller methods
 */
const handleRegister: RequestHandler = async (req, res) => {
  // Register
  try {
    const newUser = new User();
    newUser.country = req.body.country;
    newUser.email = req.body.email;
    newUser.language = req.body.language;
    newUser.name = req.body.name;
    newUser.role = req.body.role;
    newUser.password = await bcrypt.hash(req.body.password, HASH_COST);

    const validationErrors = await validate(newUser);
    if (validationErrors.length) {
      throw new Error(INVALID_USER_SCHEMA);
    }

    await authService.createUser(newUser);
    res.status(200).send({ email: newUser.email });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const handleLogin: RequestHandler = (req, res) => {
  // Login
  passport.authenticate('local', { session: false }, (error, user: User) => {
    if (error) {
      return res.status(error.statusCode).json(error.message);
    }

    if (!user) {
      return res.status(401).json(AUTH_INVALID_CREDENTIALS);
    }

    /** This is what ends up in our JWT */
    const payload = generatePayload(user);

    /** assigns payload to req.user */
    req.login(payload, { session: false }, (error) => {
      if (error) {
        res.status(error.statusCode).send(error.message);
      }

      /** generate a signed json web token and return it in the response */
      const token = jsonwebtoken.sign(JSON.stringify(payload), process.env.JWT_SECRET as string);
      res.cookie('jwt', token, { path: '/', httpOnly: true });
      res.status(200).send({ email: user.email, });
    });
  })(req, res);
};

const handleLogout: RequestHandler = (_, res) => {
  res.cookie('jwt', '', { expires: new Date(0), path: '/', httpOnly: true })
  res.status(200).send({});
};

const handleSelf: RequestHandler = async (req, res) => {
  // Returns data about logged in user
  const user = await authService.findUserByEmail((req.user as IJWTPayload).email);
  return res.status(user ? 200 : 401).send(user ? user.toJSON() : null);
};

/**
 * Controller routes
 */
authController.post('/', handleRegister);
authController.get('/', passport.authenticate('jwt', { session: false }), handleSelf)
authController.post('/login', handleLogin);
authController.post('/logout', handleLogout);
