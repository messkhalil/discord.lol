const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function ensureKey(key) {
  if (!key) throw new Error('MASTER_KEY is required');
  const buf = Buffer.from(key, 'hex');
  if (buf.length !== 32) throw new Error('MASTER_KEY must be 32 bytes (64 hex chars)');
  return buf;
}

function encrypt(text, keyHex) {
  const key = ensureKey(keyHex);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(text), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

function decrypt(payload, keyHex) {
  const key = ensureKey(keyHex);
  const parts = String(payload).split(':');
  if (parts.length !== 3) throw new Error('Invalid payload');
  const iv = Buffer.from(parts[0], 'hex');
  const tag = Buffer.from(parts[1], 'hex');
  const data = Buffer.from(parts[2], 'hex');
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };
