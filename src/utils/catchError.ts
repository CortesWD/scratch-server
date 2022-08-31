/*
 * Dependencies
 */

import { NextFunction } from "express";

interface CustomError {
  statusCode?: number
}

const catchError = (err: CustomError, next: NextFunction) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  return next(err);
}

export default catchError;