import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ShootRequestDto } from './shoot-request.dto';

describe('ShootRequestDto', () => {
  const validDto = {
    gameId: '550e8400-e29b-41d4-a716-446655440000',
    position: 'A1',
  };

  const createDto = (overrides: Partial<Record<string, any>> = {}) =>
    plainToInstance(ShootRequestDto, { ...validDto, ...overrides });

  it('should pass with valid gameId and position A1', async () => {
    const errors = await validate(createDto());
    expect(errors).toHaveLength(0);
  });

  it('should pass with position J10', async () => {
    const errors = await validate(createDto({ position: 'J10' }));
    expect(errors).toHaveLength(0);
  });

  it('should pass with position E5', async () => {
    const errors = await validate(createDto({ position: 'E5' }));
    expect(errors).toHaveLength(0);
  });

  it('should fail with invalid UUID', async () => {
    const errors = await validate(createDto({ gameId: 'not-a-uuid' }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('gameId');
  });

  it('should fail with position K1 (out of range letter)', async () => {
    const errors = await validate(createDto({ position: 'K1' }));
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('position');
  });

  it('should fail with position A0', async () => {
    const errors = await validate(createDto({ position: 'A0' }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with position A11', async () => {
    const errors = await validate(createDto({ position: 'A11' }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with lowercase position a1', async () => {
    const errors = await validate(createDto({ position: 'a1' }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with empty position', async () => {
    const errors = await validate(createDto({ position: '' }));
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when gameId is missing', async () => {
    const dto = plainToInstance(ShootRequestDto, { position: 'A1' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'gameId')).toBe(true);
  });

  it('should fail when position is missing', async () => {
    const dto = plainToInstance(ShootRequestDto, {
      gameId: '550e8400-e29b-41d4-a716-446655440000',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'position')).toBe(true);
  });
});
