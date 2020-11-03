/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from 'express';
import * as UserService from '../service/users.service';

/**
 * Router Definition
 */
export const usersRouter = express.Router();

/**
 * Controller Definitions
 */

// GET users/:id
usersRouter.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  try {
    const user = await UserService.find(id);

    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).send({ ...user, password: undefined });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// POST users/
usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    await UserService.create(req.body.user);
    res.sendStatus(201);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// DELETE users/:id
usersRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await UserService.remove(id);
    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
});
