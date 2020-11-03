/**
 * Required External Modules and Interfaces
 */
import express from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import { validate } from 'class-validator';
import * as authService from '../service/auth.service';
import { User } from '../entity/user.entity';
import { JWT_EXPIRATION_MS, HASH_COST } from '../config';

/**
 * Router Definition
 */
export const authController = express.Router();

/**
 * Controller Definitions
 */
authController.post('/', async (req, res) => {
  // Register
  // TODO: validate body
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
      throw new Error('Invalid schema for user');
    }
 
    await authService.createUser(newUser);
    res.status(200).send({ email: newUser.email });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

authController.post('/login', (req, res) => {
  // Login
  passport.authenticate('local', { session: false }, (error, user: User) => {
    if (error || !user) {
      res.status(400).json({ error });
    }

    /** This is what ends up in our JWT */
    const payload = {
      username: user.email,
      expires: Date.now() + JWT_EXPIRATION_MS,
    };

    /** assigns payload to req.user */
    req.login(payload, { session: false }, (error) => {
      if (error) {
        res.status(400).send({ error });
      }

      /** generate a signed json web token and return it in the response */
      const token = jsonwebtoken.sign(JSON.stringify(payload), process.env.JWT_SECRET as string);
      res.status(200).send({ username: user.email, token, });
    });
  })(req, res);
});
