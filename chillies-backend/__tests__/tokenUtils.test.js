const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'test-secret';

describe('tokenUtils.generateToken', () => {
  it('generates a valid JWT with user id and 1h expiration', () => {
    const { generateToken } = require('../utils/tokenUtils');
    const token = generateToken(123);
    expect(typeof token).toBe('string');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(123);
    // exp is in seconds since epoch; should be ~1 hour from iat
    expect(decoded.exp - decoded.iat).toBeLessThanOrEqual(3600 + 5);
    expect(decoded.exp - decoded.iat).toBeGreaterThanOrEqual(3600 - 5);
  });
});

