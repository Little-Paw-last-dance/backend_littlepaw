import {Request, Response, NextFunction} from 'express';
import {auth} from '../config/firebaseConfig';
import { FirebaseUser } from '../model/firebaseUser';
import HttpException from '../exception/HttpException';
import typeORM from '../db/dataSource';
import User from '../entity/User';
import Role from '../entity/Roles';
import logger from '../config/logger';

export const authenticationValidation = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    logger.warn('Invalid or missing token');
    res.status(400).json(new HttpException('Invalid or missing token', 400));
  } else {
    auth
      .verifyIdToken(accessToken ?? '')
      .then(decodedToken => {
        const firebaseUser: FirebaseUser = JSON.parse(JSON.stringify(decodedToken));
        res.locals.firebaseUser = firebaseUser;
        next();
      })
      .catch(error => {
        logger.error('Error verifying token: %o', error);
        if (error.code === 'auth/id-token-expired') {
          res.status(401).json(new HttpException('Token expired', 401));
        } else {
          res.status(400).json(new HttpException('Invalid token provided', 400));
        }
      });
  }
};


export const getRoles = async (req: Request, res: Response, next: NextFunction) => {
  const firebaseUser: FirebaseUser = res.locals.firebaseUser;
  const userRoles = await typeORM.manager.findOne<User>('User', { where: { email: firebaseUser.email }, relations: ['roles'] });

  if (!userRoles) {
    logger.warn('No roles found for user: %s', firebaseUser.email);
    res.status(404).json(new HttpException('User roles not found', 404));
    return;
  }

  res.locals.roles = userRoles?.roles;
  next();
};