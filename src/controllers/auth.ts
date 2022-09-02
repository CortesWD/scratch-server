/*
 * Dependencies
 */
import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult, body } from 'express-validator';

/*
 * Models
 */
import { iUser, User } from '../models/user.js';

/*
 * Others
 */
import catchError from '../utils/catchError.js';
import { CustomError } from '../utils/generic.js';

const login: RequestHandler = async (req, res, next) => {
  const { email, password } = (req.body as iUser);
  const errors = validationResult(req);
  const invalidCredentials = new CustomError(401, 'invalid credentials');

  try {
    if (!errors.isEmpty()) {
      const error = new CustomError(422, 'Validation failed');
      throw error;
    }

    const user = await User.findOne({ email });

    if (!user) { throw invalidCredentials; };

    const matchPwd = await bcrypt.compare(password, user.password);

    if (!matchPwd) { throw invalidCredentials; };

    const token = jwt.sign({
      email,
      userId: user._id.toString()
    }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    req.session.isLoggedIn = true;
    req.session.user = user;

    res.status(200)
      .json({
        token,
        userId: user._id.toString()
      });

  } catch (error) {
    catchError(error as object, next);
  }
}

const signUp: RequestHandler = async (req, res, next) => {
  const { password, email } = (req.body as iUser);
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new CustomError(422, 'Validation failed');
      throw error;
    }

    const bcPwd = await bcrypt.hash(password, 16);

    const user = new User({
      email,
      password: bcPwd
    });

    const savedUser = await user.save();

    res.status(201)
      .json({
        message: 'user created',
        userId: savedUser._id
      });

  } catch (error) {
    catchError(error as object, next);
  }

};

const passwordValidation = () => {
  return [
    body('password', 'invalid password')
      .isLength({ min: 6 })
      .isString()
      .trim()
  ]
}

const router = express.Router();

router.post('/signup', passwordValidation(), signUp);
router.post('/access_user', passwordValidation(), login);

export default router;