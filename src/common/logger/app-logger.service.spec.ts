import { ConsoleLogger } from '@nestjs/common';
import { AppLogger } from './app-logger.service';
import * as requestContext from '../context/request-context';

describe('AppLogger', () => {
  let logger: AppLogger;
  let spyLog: jest.SpyInstance;
  let spyWarn: jest.SpyInstance;
  let spyError: jest.SpyInstance;
  let spyDebug: jest.SpyInstance;

  beforeEach(() => {
    logger = new AppLogger();
    spyLog = jest.spyOn(ConsoleLogger.prototype, 'log').mockImplementation();
    spyWarn = jest.spyOn(ConsoleLogger.prototype, 'warn').mockImplementation();
    spyError = jest
      .spyOn(ConsoleLogger.prototype, 'error')
      .mockImplementation();
    spyDebug = jest
      .spyOn(ConsoleLogger.prototype, 'debug')
      .mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should prefix log messages with request ID', () => {
    jest.spyOn(requestContext, 'getRequestId').mockReturnValue('req-123');
    logger.log('test message');
    expect(spyLog).toHaveBeenCalledWith('[req-123] test message');
  });

  it('should prefix warn messages with request ID', () => {
    jest.spyOn(requestContext, 'getRequestId').mockReturnValue('req-456');
    logger.warn('warning message');
    expect(spyWarn).toHaveBeenCalledWith('[req-456] warning message');
  });

  it('should prefix error messages with request ID', () => {
    jest.spyOn(requestContext, 'getRequestId').mockReturnValue('req-789');
    logger.error('error message');
    expect(spyError).toHaveBeenCalledWith('[req-789] error message');
  });

  it('should prefix debug messages with request ID', () => {
    jest.spyOn(requestContext, 'getRequestId').mockReturnValue('req-000');
    logger.debug('debug message');
    expect(spyDebug).toHaveBeenCalledWith('[req-000] debug message');
  });
});
