import privateKeyDecryption from "./privateKeyPemDecryption";

const privateKeyPemDecryptionBlock = (privateKeyPem, block, size) => {
  if (block.length % size !== 0) {
    console.log("WHAT ON EARTCH");
    return null;
  }
  let result = [];
  for (let i = 0; i < block.length; i += size) {
    const data = block.slice(i, i + size);
    result.push(privateKeyDecryption(privateKeyPem, data));
  }
  return result;
};

export default privateKeyPemDecryptionBlock;
