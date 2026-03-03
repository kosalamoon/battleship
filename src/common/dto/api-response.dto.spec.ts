import { ApiResponse } from './api-response.dto';

describe('ApiResponse', () => {
  describe('success', () => {
    it('should create a success response with data', () => {
      const result = ApiResponse.success({ id: 1 }, 'OK');

      expect(result.success).toBe(true);
      expect(result.message).toBe('OK');
      expect(result.statusCode).toBe(200);
      expect(result.data).toEqual({ id: 1 });
    });

    it('should use custom status code', () => {
      const result = ApiResponse.success(null, 'Created', 201);

      expect(result.statusCode).toBe(201);
    });
  });

  describe('error', () => {
    it('should create an error response', () => {
      const result = ApiResponse.error('Not Found', 404, 'Resource missing');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Not Found');
      expect(result.statusCode).toBe(404);
      expect(result.error).toBe('Resource missing');
    });

    it('should work without error detail', () => {
      const result = ApiResponse.error('Bad Request', 400);

      expect(result.error).toBeUndefined();
    });
  });
});
