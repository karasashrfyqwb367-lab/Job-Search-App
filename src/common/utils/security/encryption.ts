import CryptoJS from "crypto-js";

export const encryptMobile = async (plainNumber: string, secretKey: string): Promise<string> => {
  if (!plainNumber) throw new Error("Mobile number is required");
  if (!secretKey) throw new Error("Secret key is required");

  return CryptoJS.AES.encrypt(plainNumber, secretKey).toString();
};

export const decryptMobile = async (
  cipherText: string | null,
  secretKey: string
): Promise<string | null> => {
  if (!cipherText) return null; 
  if (!secretKey) throw new Error("Secret key is required");

  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
