import express from 'express';
import winston from 'winston';

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.cli(),
    transports: [new winston.transports.Console()],
  });
  

  const loggerMiddleware = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  };

  export default loggerMiddleware;
