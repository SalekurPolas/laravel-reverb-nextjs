export async function tokenizer(token) {
  if (!token) {
    return "Error: No token provided";
  }

  try {
    const secret = process.env.NEXT_PUBLIC_AES_SECRET;

    if (!secret) {
      return "Error: Secret missing";
    }

    const keyRaw = Uint8Array.from(atob(secret), (c) => c.charCodeAt(0));
    const blob = Uint8Array.from(atob(token), (c) => c.charCodeAt(0));

    if (blob.length < 12 + 16) {
      return "Error: Invalid token length";
    }

    const iv = blob.slice(0, 12);
    const tag = blob.slice(12, 28);
    const cipher = blob.slice(28);

    const data = new Uint8Array([...cipher, ...tag]);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyRaw,
      "AES-GCM",
      false,
      ["decrypt"]
    );

    let decrypted;
    
    try {
      decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        data
      );
    } catch (err) {
      return "Error: Invalid decryption secret";
    }

    try {
      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decrypted));
    } catch (err) {
      return "Error: Invalid token payload";
    }
  } catch (err) {
    return `Error: ${err.message}`;
  }
}
