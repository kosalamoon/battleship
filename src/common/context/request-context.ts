import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  requestId: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export const getRequestId = (): string =>
  requestContextStorage.getStore()?.requestId ?? '-';
