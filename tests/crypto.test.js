const { encrypt, decrypt } = require('../src/crypto');

const KEY = Buffer.alloc(32).toString('hex');

test('encrypt and decrypt roundtrip', () => {
  const text = 'my-secret-token-123';
  const enc = encrypt(text, KEY);
  expect(typeof enc).toBe('string');
  const dec = decrypt(enc, KEY);
  expect(dec).toBe(text);
});
