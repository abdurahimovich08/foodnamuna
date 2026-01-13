// Bcrypt utility for password hashing
// Note: In production, use a proper bcrypt library
// For Vercel serverless, we'll use a compatible approach

import * as crypto from 'crypto';

// Simple hash function (for development)
// In production, use proper bcrypt library
export function hashPassword(password: string): string {
  // This is a placeholder - in production use bcrypt
  // For now, we'll use a simple approach that works in serverless
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `$2b$10$${salt}${hash}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  // Extract salt and hash from stored value
  if (!hash.startsWith('$2b$10$')) {
    return false;
  }
  
  // For development: simple comparison
  // In production, use proper bcrypt.compare
  try {
    // If it's a real bcrypt hash, we need to use bcrypt library
    // For now, we'll check if it matches our format
    const parts = hash.split('$');
    if (parts.length < 4) return false;
    
    // This is a simplified check - in production use bcrypt.compare
    // For development, we'll use a workaround
    return hashPassword(password) === hash || verifyBcryptHash(password, hash);
  } catch {
    return false;
  }
}

// Helper to verify bcrypt hash (simplified)
function verifyBcryptHash(password: string, hash: string): boolean {
  // In production, use: const bcrypt = require('bcrypt'); return bcrypt.compareSync(password, hash);
  // For Vercel serverless, we need to use bcryptjs or similar
  // This is a placeholder - replace with actual bcrypt verification
  return false;
}
