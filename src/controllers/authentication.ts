import express from 'express';

import { createUser, getUsersByEmail } from '../db/users';
import { authentication, random } from '../helpers';

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUsersByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }
    const salt = random();

    const newUser = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(newUser).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('no email or password');
      return res.sendStatus(400);
    }

    const user = await getUsersByEmail(email).select(
      '+authentication.salt +authentication.password',
    );

    if (!user) {
      console.log('no user found');
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (expectedHash !== user.authentication.password) {
      return res.sendStatus(403);
    }

    const salt = random();

    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString(),
    );
    await user.save();

    res.cookie('token', user.authentication.sessionToken, { httpOnly: true });

    return res.status(200).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
