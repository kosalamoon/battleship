import { LoggingMiddleware } from './logging.middleware';
import { AppLogger } from '../logger/app-logger.service';
import { Request, Response } from 'express';

describe('LoggingMiddleware', () => {
  let middleware: LoggingMiddleware;
  let logger: { log: jest.Mock };

  beforeEach(() => {
    logger = { log: jest.fn() };
    middleware = new LoggingMiddleware(logger as unknown as AppLogger);
  });

  it('should set X-Request-Id header and call next', () => {
    const req = { method: 'GET', path: '/test' } as unknown as Request;
    const res = {
      setHeader: jest.fn(),
      on: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(res.setHeader).toHaveBeenCalledWith(
      'X-Request-Id',
      expect.any(String),
    );
    expect(next).toHaveBeenCalled();
  });

  it('should log on response finish', () => {
    const req = { method: 'GET', path: '/test' } as unknown as Request;
    let finishCallback: () => void;
    const res = {
      setHeader: jest.fn(),
      on: jest.fn((event: string, cb: () => void) => {
        if (event === 'finish') finishCallback = cb;
      }),
      statusCode: 200,
    } as unknown as Response;
    const next = jest.fn();

    middleware.use(req, res, next);
    finishCallback!();

    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('GET /test 200'),
      'HTTP',
    );
  });
});
