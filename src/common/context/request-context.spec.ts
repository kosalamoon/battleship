import { requestContextStorage, getRequestId } from './request-context';

describe('RequestContext', () => {
  it('should return request ID from store', () => {
    requestContextStorage.run({ requestId: 'test-123' }, () => {
      expect(getRequestId()).toBe('test-123');
    });
  });

  it('should return "-" when no store is active', () => {
    expect(getRequestId()).toBe('-');
  });
});
