import crypto from 'crypto';

async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function hashEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return new Promise((resolve, reject) => {
    sha256(normalizedEmail)
      .then((hash) => {
        resolve(hash);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
