// utils/fieldEncoding.js
export function encodeToField(str, key) {
    const textBytes = new TextEncoder().encode(str);
    const keyBytes  = new TextEncoder().encode(key);
    const encrypted = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
    let hex = [...encrypted].map(b => b.toString(16).padStart(2,"0")).join("");
    // hex → BigInt → decimal string, then suffix "field"
    return BigInt("0x" + hex).toString() + "field";
  }
  
  export function decodeFromField(fieldStr, key) {
    // 1) strip ".private" if present
    let raw = fieldStr.endsWith(".private")
      ? fieldStr.slice(0, -".private".length)
      : fieldStr;
    // 2) strip "field" suffix
    if (raw.endsWith("field")) raw = raw.slice(0, -"field".length);
  
    // 3) parse the decimal to BigInt, to hex
    let hex = BigInt(raw).toString(16);
    if (hex.length % 2) hex = "0" + hex;
  
    // 4) hex → bytes
    const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(h => parseInt(h,16)));
    const keyBytes = new TextEncoder().encode(key);
  
    // 5) XOR‑decrypt
    const decrypted = bytes.map((b,i) => b ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(decrypted);
  }
  