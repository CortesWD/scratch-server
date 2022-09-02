/*
 * Dependencies
 */
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

/*
* Others
*/
import { iUser, User } from '../models/user.js';

const isAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  
  const token = authHeader ? authHeader.split(' ')[1] : '';
  let decodedToken: any;

  if (!authHeader) {
    req.session.isLoggedIn = false;
    return next();
  }

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    req.session.isLoggedIn = false;
    return next();
  }

  if (!decodedToken) {
    req.session.isLoggedIn = false;
    return next();
  }

  const user = await User.findById(decodedToken?.userId) as iUser;

  req.session.isLoggedIn = true;
  req.session.user = user;
  next();
}

export default isAuth;