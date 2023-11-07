import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySession } from '../db/users';

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const sessionToken = req.cookies['token'];
    if (!sessionToken) {
      console.log('no session token');
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySession(sessionToken);

    if (!existingUser) {
      console.log('no user');
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, 'identity._id', '') as string;

    if (!currentUserId) {
      console.log('no user id');
      return res.sendStatus(400);
    }

    if (id !== currentUserId.toString()) {
      console.log('id dose not match');
      return res.sendStatus(403);
    }

    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
