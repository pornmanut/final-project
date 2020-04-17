import forge from "node-forge";

const keyDecryption = (key, iv, encrypted) => {
  const _key = forge.util.hexToBytes(key);
  const _iv = forge.util.hexToBytes(iv);
  const _encrypted = forge.util.createBuffer(forge.util.hexToBytes(encrypted));
  const decipher = forge.cipher.createDecipher("AES-CBC", _key);
  decipher.start({ iv: _iv });
  decipher.update(_encrypted);
  decipher.finish();
  const decrypted = decipher.output;
  return decrypted.toHex();
};

//   const message =
//     "50b9c803e9db0698eed8dee57ec2f37c3af130ab795bbc81e5eeed757835d81dfad42523d9a897137c9894044366de3ec17e99a125b2a53f0e1edc5c9f583a178b716f8ade4446d8dad2fa9587b778c11529e37d240f19eb4455158fd4bcffe91c45e23267a388c139541c41dd3f61c5c057c6ff33cf8e7bb25b0e409b4eca15";
//   const cipher = forge.cipher.createCipher("AES-CBC", key);
//   const bytes = forge.util.hexToBytes(message);
//   cipher.start({ iv: iv });
//   cipher.update(forge.util.createBuffer(bytes));
//   cipher.finish();
//   const encrypted = cipher.output;
//   console.log(encrypted.toHex().length / 2);

//   const decipher = forge.cipher.createDecipher("AES-CBC", key);
//   decipher.start({ iv: iv });
//   decipher.update(encrypted);
//   decipher.finish();
//   // outputs decrypted hex
//   console.log(decipher.output.toHex());
//   console.log(decipher.output.toHex() == message);
export default keyDecryption;
