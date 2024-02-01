import crypto from 'crypto';
const algorithm = 'aes-256-cbc';

export function encryptBuffer(inputBuffer: Buffer | string, secretKey: string) {
    if (typeof inputBuffer == 'string') {
        inputBuffer = Buffer.from(inputBuffer);
    }
    while (secretKey.length < 32) secretKey += secretKey;
    if (secretKey.length >= 32) secretKey = secretKey.substring(0, 32);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  
    return Buffer.concat([ iv, cipher.update(inputBuffer), cipher.final() ]);
}
  
export function decryptedBuffer(encryptedBuffer: Buffer | string, secretKey: string) {
    if (typeof encryptedBuffer == 'string') {
        encryptedBuffer = Buffer.from(encryptedBuffer);
    }
    while (secretKey.length < 32) secretKey += secretKey;
    if (secretKey.length >= 32) secretKey = secretKey.substring(0, 32);

    const iv = encryptedBuffer.slice(0, 16);
    const encryptedData = encryptedBuffer.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
  
    return Buffer.concat([ decipher.update(encryptedData), decipher.final() ]);
}
