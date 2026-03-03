import { ConsoleLogger, Injectable } from '@nestjs/common';
import { getRequestId } from '../context/request-context';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private prefix(): string {
    return `[${getRequestId()}]`;
  }

  log(message: any, ...args: any[]): void {
    super.log(`${this.prefix()} ${message}`, ...args);
  }

  warn(message: any, ...args: any[]): void {
    super.warn(`${this.prefix()} ${message}`, ...args);
  }

  error(message: any, ...args: any[]): void {
    super.error(`${this.prefix()} ${message}`, ...args);
  }

  debug(message: any, ...args: any[]): void {
    super.debug(`${this.prefix()} ${message}`, ...args);
  }
}
